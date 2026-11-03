/**
 * DaimoArc lead endpoint: a Google Apps Script web app bound to the "Daimoarc Leads" sheet.
 *
 * The /exec URL is public (it ships in the website's code), so anyone can send requests to it without
 * using the form. Every check that matters therefore lives here, in this order:
 *   size cap → JSON only → honeypot → signed one-time form token (minimum fill time, expiry, no replays)
 *   → strict field checks and allowlists → rate limits (global, per email, duplicates)
 *   → formula-safe writes to the sheet → capped notification emails.
 * Rejections only ever return a short status word, never internal details.
 *
 * Deploy: Execute as "Me", Who has access "Anyone". After changing this file, use
 * Deploy → Manage deployments → edit (pencil) the existing deployment → Version: New version → Deploy.
 * That keeps the same /exec URL, so the website needs no change.
 */

const SHEET_ID = '18HkMLLlUOzXcDfC3ON0qbqIvDI0upmtuksPB3wfUH8k';
const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = 'daimoarc@gmail.com';

// These must match the options in src/components/ProjectInquiryForm.jsx exactly
const SERVICES = [
  'AI & Machine Learning',
  'Product Engineering / MVP',
  'Custom SaaS Platform',
  'POS & Retail System',
  'Web & Mobile Development',
  'WordPress, Shopify & TikTok Store',
  'Cloud Services',
  'DevOps, CI/CD, SecOps & NetOps',
  'Marketing & Meta Ads',
  'Requirement Engineering',
  'Not sure yet',
];
const BUDGETS = ['Under £1,000', '£1,000 – £5,000', '£5,000 – £15,000', '£15,000 – £50,000', '£50,000+', 'Not sure yet'];
const TIMELINES = ['ASAP', '2–4 weeks', '1–3 months', 'Flexible'];
const PREFERRED_CONTACTS = ['Email', 'Phone call'];

const LIMITS = {
  maxBodyChars: 20000,
  minFillMs: 3000, // nobody fills in the whole form in under 3 seconds
  tokenMaxAgeMs: 2 * 60 * 60 * 1000,
  globalPerHour: 20, // far above normal traffic, low enough to stop a flood
  perEmailPerHour: 3,
  duplicateWindowSec: 600,
  emailsPerDay: 40, // Gmail allows about 100 a day on a free account, so real leads always get through
  maxLinks: 3,
  eventsPerDay: 1000, // per count, so nobody can inflate the numbers or use up the script's daily allowance
};

// Anonymous daily totals for the form, in a "Funnel" tab: how many people start it, finish each step and
// send it. Only counts are stored: no names, emails, IP addresses or anything that identifies a visitor
const FUNNEL_SHEET = 'Funnel';
const FUNNEL_COLUMNS = ['Date', 'Started', 'Step 1 done', 'Step 2 done', 'Sent'];
const FUNNEL_EVENTS = { started: 2, step1: 3, step2: 4, sent: 5 }; // column number for each count

// Throwaway inbox providers, also listed in the form. Add more if spam starts coming from elsewhere
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'grr.la', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'tempmail.dev', 'yopmail.com', 'trashmail.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'emailondeck.com',
  'mohmal.com', 'burnermail.io', 'moakt.com', 'tempinbox.com', 'mailnesia.com', 'spamgourmet.com',
];

function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action === 'token') {
    countEvent('started'); // the form asks for a token the first time someone uses it
    return reply({ status: 'ok', token: issueToken() });
  }
  if (params.action === 'event') {
    if (params.name === 'step1' || params.name === 'step2') countEvent(params.name);
    return reply({ status: 'ok' });
  }
  return reply({ status: 'ok' });
}

function doPost(e) {
  try {
    const raw = e && e.postData && typeof e.postData.contents === 'string' ? e.postData.contents : '';
    if (!raw || raw.length > LIMITS.maxBodyChars) return reply({ status: 'invalid' });

    let input;
    try {
      input = JSON.parse(raw);
    } catch (err) {
      return reply({ status: 'invalid' });
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return reply({ status: 'invalid' });

    // Honeypot: bots that fill every field get a normal-looking reply and nothing is stored
    if (input.website) return reply({ status: 'ok', reference: newReference() });

    const tokenState = checkToken(input.token);
    if (tokenState !== 'ok') return reply({ status: tokenState });

    const lead = validateLead(input);
    if (!lead) return reply({ status: 'invalid' });

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return reply({ status: 'busy' });
    try {
      const limit = applyLimits(lead);
      if (limit) return reply({ status: limit });
      const reference = newReference();
      saveLead(lead, reference);
      markTokenUsed(input.token);
      bumpFunnel('sent');
      notifyOwner(lead, reference);
      return reply({ status: 'ok', reference: reference });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return reply({ status: 'error' });
  }
}

/* ── Form token ──
   The form asks for a token when someone starts filling it in. It is signed with a secret only this
   script knows, so it can't be forged, and it proves the form was open for a few seconds before sending.
   Each token works once, which stops a captured request being replayed thousands of times. */

function formSecret() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('FORM_SECRET');
  if (!secret) {
    secret = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('FORM_SECRET', secret);
  }
  return secret;
}

function sign(text) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(text, formSecret())).replace(/=+$/, '');
}

function issueToken() {
  const body = Date.now() + '.' + Utilities.getUuid();
  return body + '.' + sign(body);
}

function checkToken(token) {
  if (typeof token !== 'string' || token.length > 200) return 'invalid';
  const parts = token.split('.');
  if (parts.length !== 3 || !/^\d{13}$/.test(parts[0])) return 'invalid';
  if (sign(parts[0] + '.' + parts[1]) !== parts[2]) return 'invalid';
  const age = Date.now() - Number(parts[0]);
  if (age < LIMITS.minFillMs) return 'invalid';
  if (age > LIMITS.tokenMaxAgeMs) return 'expired';
  if (CacheService.getScriptCache().get('used:' + parts[1])) return 'invalid';
  return 'ok';
}

function markTokenUsed(token) {
  CacheService.getScriptCache().put('used:' + token.split('.')[1], '1', 21600);
}

/* ── Field checks ── */

function validateLead(input) {
  const name = cleanText(input.name, 80, false);
  const email = cleanText(input.email, 254, false).toLowerCase();
  const phone = cleanText(input.phone, 20, false);
  const message = cleanText(input.message, 5000, true);
  const services = input.services;

  if (name.length < 2 || countLetters(name) < 2 || /https?:|www\.|[<>@]/i.test(name)) return null;
  if (!isEmail(email)) return null;
  if (!Array.isArray(services) || services.length < 1 || services.length > SERVICES.length) return null;
  if (services.some(function (s) { return SERVICES.indexOf(s) === -1; })) return null;
  if (new Set(services).size !== services.length) return null;
  if (BUDGETS.indexOf(input.budget) === -1 || TIMELINES.indexOf(input.timeline) === -1) return null;
  if (PREFERRED_CONTACTS.indexOf(input.preferredContact) === -1) return null;
  if (input.consent !== true) return null;
  if (phone ? !isPhone(phone) : input.preferredContact === 'Phone call') return null;
  if (message.length < 20 || countLetters(message) < 10) return null;
  if ((message.match(/https?:\/\/|www\./gi) || []).length > LIMITS.maxLinks) return null;

  return {
    name: name, email: email, phone: phone, services: services.slice(),
    budget: input.budget, timeline: input.timeline, preferredContact: input.preferredContact, message: message,
  };
}

// Removes control characters and invisible direction or zero-width marks that can disguise text.
// Text over the limit is rejected rather than cut short
function cleanText(value, max, multiline) {
  if (typeof value !== 'string') return '';
  let text = value.normalize('NFC')
    .replace(/[​-‏‪-‮⁦-⁩﻿]/g, '')
    .replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '')
    .trim();
  if (multiline) text = text.replace(/\r\n?/g, '\n').replace(/\n{4,}/g, '\n\n\n');
  return text.length > max ? '' : text;
}

function countLetters(text) {
  return (text.match(/\p{L}/gu) || []).length;
}

function isEmail(email) {
  const match = /^([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*)@((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24}|xn--[a-z0-9-]{1,59}))$/.exec(email);
  if (!match || match[1].length > 64) return false;
  const domain = match[2];
  return !DISPOSABLE_DOMAINS.some(function (d) { return domain === d || domain.slice(-(d.length + 1)) === '.' + d; });
}

// The form sends numbers in international format (+447700900123). Obvious fakes are refused:
// seven or more of the same digit in a row, or eight or more digits counting up or down
function isPhone(phone) {
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) return false;
  const digits = phone.slice(1);
  if (/(\d)\1{6,}/.test(digits)) return false;
  let up = 1;
  let down = 1;
  for (let i = 1; i < digits.length; i++) {
    const step = (digits.charCodeAt(i) - digits.charCodeAt(i - 1) + 10) % 10;
    up = step === 1 ? up + 1 : 1;
    down = step === 9 ? down + 1 : 1;
    if (up >= 8 || down >= 8) return false;
  }
  return true;
}

/* ── Rate limits ── */

function applyLimits(lead) {
  const cache = CacheService.getScriptCache();
  const hour = Math.floor(Date.now() / 3600000);
  const duplicateKey = 'dup:' + digest(lead.email + '\n' + lead.message);
  if (cache.get(duplicateKey)) return 'duplicate';

  const globalKey = 'g:' + hour;
  const emailKey = 'e:' + digest(lead.email) + ':' + hour;
  const globalCount = Number(cache.get(globalKey) || 0);
  const emailCount = Number(cache.get(emailKey) || 0);
  if (globalCount >= LIMITS.globalPerHour || emailCount >= LIMITS.perEmailPerHour) {
    alertOwnerOnce();
    return 'limited';
  }
  cache.put(globalKey, String(globalCount + 1), 3600);
  cache.put(emailKey, String(emailCount + 1), 3600);
  cache.put(duplicateKey, '1', LIMITS.duplicateWindowSec);
  return '';
}

// Emails are only ever stored here as a scrambled hash that expires within an hour
function digest(text) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)
  ).replace(/=+$/, '');
}

/* ── Saving and notifying ── */

function saveLead(lead, reference) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Budget', 'Timeline', 'Preferred Contact', 'Message', 'Reference', 'Source', 'Honeypot']);
  }
  sheet.appendRow([
    new Date(), asText(lead.name), asText(lead.email), asText(lead.phone), lead.services.join(', '),
    lead.budget, lead.timeline, lead.preferredContact, asText(lead.message), reference, 'DaimoArc website', '',
  ]);
}

// Google Sheets runs any cell that starts with = + - or @ as a formula. A leading apostrophe stores the
// value as plain text instead. That stops formula injection (for example =IMPORTXML sending other
// leads' details to an outside server) and keeps phone numbers like +447700900123 exactly as sent
function asText(value) {
  return value === '' ? '' : "'" + value;
}

function newReference() {
  return 'DM-' + Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
}

// Counts notification emails per day so a flood can't use up Gmail's daily sending limit
function canSendMail() {
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyyMMdd');
  const count = props.getProperty('mailDay') === today ? Number(props.getProperty('mailCount') || 0) : 0;
  if (count >= LIMITS.emailsPerDay) return false;
  props.setProperties({ mailDay: today, mailCount: String(count + 1) });
  return true;
}

function notifyOwner(lead, reference) {
  if (!canSendMail()) return; // the lead is already saved in the sheet
  try {
    GmailApp.sendEmail(
      NOTIFY_EMAIL,
      'New DaimoArc project brief: ' + lead.services.join(', '),
      [
        'New project brief from the website', '',
        'Reference: ' + reference,
        'Name: ' + lead.name,
        'Email: ' + lead.email,
        'Phone: ' + (lead.phone || 'Not provided'),
        'Services: ' + lead.services.join(', '),
        'Budget: ' + lead.budget,
        'Timeline: ' + lead.timeline,
        'Preferred contact: ' + lead.preferredContact, '',
        'Project goals:', lead.message,
      ].join('\n'),
      { replyTo: lead.email, name: 'DaimoArc website' }
    );
  } catch (err) {
    console.error('Notification email failed', err);
  }
}

// One warning email per day when the form hits its limits, which usually means a spam attack
function alertOwnerOnce() {
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyyMMdd');
  if (props.getProperty('alertDay') === today) return;
  props.setProperty('alertDay', today);
  if (!canSendMail()) return;
  try {
    GmailApp.sendEmail(
      NOTIFY_EMAIL,
      'DaimoArc form: spam limit reached',
      'The project form reached its hourly limit today, which usually means automated spam. Extra requests are being ' +
        'refused, real leads already received are safe in the sheet, and the limit resets every hour. Nothing needs doing ' +
        'unless this keeps happening.'
    );
  } catch (err) {
    console.error('Alert email failed', err);
  }
}

/* ── Funnel counts ── */

function countEvent(name) {
  if (!FUNNEL_EVENTS[name]) return;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return; // a missed count is better than a slow form
  try {
    bumpFunnel(name);
  } finally {
    lock.releaseLock();
  }
}

// Adds one to today's count. Callers must already hold the script lock
function bumpFunnel(name) {
  const column = FUNNEL_EVENTS[name];
  if (!column) return;
  try {
    const today = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyy-MM-dd');
    const cache = CacheService.getScriptCache();
    const capKey = 'ev:' + name + ':' + today;
    const seen = Number(cache.get(capKey) || 0);
    if (seen >= LIMITS.eventsPerDay) return;
    cache.put(capKey, String(seen + 1), 21600);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(FUNNEL_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(FUNNEL_SHEET);
      sheet.appendRow(FUNNEL_COLUMNS);
    }
    let row = sheet.getLastRow();
    if (row < 2 || sheet.getRange(row, 1).getDisplayValue() !== today) {
      sheet.appendRow(["'" + today, 0, 0, 0, 0]); // the date is stored as text so it reads the same everywhere
      row = sheet.getLastRow();
    }
    const cell = sheet.getRange(row, column);
    cell.setValue(Number(cell.getValue() || 0) + 1);
  } catch (err) {
    console.error('Funnel count failed', err);
  }
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

/* ── Maintenance ── */

// Deletes enquiries older than 12 months, as the privacy policy promises. To run it automatically:
// Triggers (clock icon) → Add trigger → purgeOldLeads → Time-driven → Day timer
function purgeOldLeads() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return;
  const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const stamps = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = stamps.length - 1; i >= 0; i--) {
    const time = stamps[i][0] instanceof Date ? stamps[i][0].getTime() : NaN;
    if (time < cutoff) sheet.deleteRow(i + 2);
  }
}

// Run this once manually from the Apps Script editor (select "formatSheet" in
// the function dropdown, click Run) to style the Leads sheet to match the
// DaimoArc website theme (navy header, cyan accent, light body rows).
function formatSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Leads');
  if (!sheet) throw new Error('Leads sheet not found — submit one lead first so it gets created.');

  const lastCol = 12; // A–L: Timestamp..Honeypot

  const headerRange = sheet.getRange(1, 1, 1, lastCol);
  headerRange
    .setBackground('#0a0e1a')
    .setFontColor('#00c8e8')
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);

  const maxRows = Math.max(sheet.getMaxRows(), 200);
  const bodyRange = sheet.getRange(2, 1, maxRows - 1, lastCol);
  bodyRange
    .setFontFamily('Arial')
    .setFontColor('#0e1726')
    .setVerticalAlignment('middle')
    .setWrap(true);

  const existingBandings = sheet.getBandings();
  for (let i = 0; i < existingBandings.length; i++) existingBandings[i].remove();

  const dataRange = sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 2), lastCol);
  const banding = dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  banding
    .setHeaderRowColor('#0a0e1a')
    .setFirstRowColor('#eef3fb')
    .setSecondRowColor('#ffffff');

  const widths = [150, 140, 200, 120, 260, 130, 100, 130, 320, 140, 140, 100];
  for (let c = 0; c < widths.length; c++) {
    sheet.setColumnWidth(c + 1, widths[c]);
  }

  SpreadsheetApp.flush();
}
