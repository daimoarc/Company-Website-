const SHEET_ID = '18HkMLLlUOzXcDfC3ON0qbqIvDI0upmtuksPB3wfUH8k';


function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "DAIMOARC lead endpoint is active." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');

    // Form sends `services` (array, multi-select) instead of a single `service` string.
    const services = Array.isArray(payload.services) ? payload.services.join(', ') : (payload.service || '');

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('Leads');

    if (!sheet) {
      sheet = ss.insertSheet('Leads');
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Budget', 'Timeline', 'Preferred Contact', 'Message', 'Reference', 'Source', 'Honeypot']);
    }

    const row = [
      new Date(),
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      services,
      payload.budget || '',
      payload.timeline || '',
      payload.preferredContact || '',
      payload.message || '',
      payload.submissionId || '',
      payload.source || '',
      payload.website || ''
    ];

    sheet.appendRow(row);

    try {
      const emailBody =
        'New DAIMOARC lead received\n\n' +
        'Name: ' + (payload.name || '') + '\n' +
        'Email: ' + (payload.email || '') + '\n' +
        'Phone: ' + (payload.phone || '') + '\n' +
        'Services: ' + (services || '') + '\n' +
        'Budget: ' + (payload.budget || '') + '\n' +
        'Timeline: ' + (payload.timeline || '') + '\n' +
        'Preferred Contact: ' + (payload.preferredContact || '') + '\n' +
        'Reference: ' + (payload.submissionId || '') + '\n\n' +
        'Project brief:\n' + (payload.message || '');

      GmailApp.sendEmail(
        'daimoarc@gmail.com',
        'New DAIMOARC project brief: ' + (services || 'Website enquiry'),
        emailBody
      );
    } catch (mailError) {
      console.error('Email notification failed:', mailError);
      // Row is already saved — don't fail the whole request over email.
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', submitted: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error(error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
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
