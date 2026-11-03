# The project form's backend (Google Apps Script)

The form on `/contact` sends briefs to a Google Apps Script web app that is attached to the
"Daimoarc Leads" Google Sheet. The script's source is [Code.gs](Code.gs) in this folder. Keep the
live script and this file the same.

## What the script protects against

The web app's `/exec` URL ships in the website's code, so anyone can send requests to it without
using the form. That's normal for this kind of setup, and the script is built for it:

- **Bots and replays:** every brief needs a signed one-time token, which the form requests when someone
  starts typing. A brief is refused if it arrives within 3 seconds of the token being issued, or if the
  token is older than 2 hours or has already been used. A hidden honeypot field catches bots that fill
  in every field.
- **Junk details:** names, emails, phone numbers, messages and consent are all checked again on the
  server. Services, budget and timeline must be one of the form's options. Throwaway inboxes, fake phone
  numbers (like 1111111 or 12345678) and messages with more than 3 links are refused.
- **Floods:** the form accepts at most 20 briefs an hour in total and 3 an hour from the same email
  address, and drops a repeat of the same brief within 10 minutes. When a limit is hit, you get one
  warning email that day.
- **Your inbox:** notification emails stop at 40 a day, so a flood can't use up Gmail's sending limit.
  Leads are still saved to the sheet.
- **The sheet itself:** every typed answer is stored as plain text. A name like `=IMPORTXML(...)` can't
  run as a formula that sends other leads' details to an outside server. This also keeps phone numbers
  like `+447700900123` exactly as sent.
- **Error replies:** only short status words are ever sent back, never internal details.

## Updating the live script

Do this whenever [Code.gs](Code.gs) changes. If the website changed at the same time, put the new website live first.

1. Open the "Daimoarc Leads" sheet and go to **Extensions → Apps Script**.
2. Select everything in `Code.gs`, delete it, paste in the whole of [Code.gs](Code.gs), and click **Save**.
3. Click **Deploy → Manage deployments**, click the pencil icon on the existing deployment, set
   **Version** to **New version** and click **Deploy**. This keeps the same `/exec` URL, so
   [src/config.js](src/config.js) doesn't change. If Google asks you to authorise the script, approve it.
   It's your own script.
4. Check it: open the `/exec` URL with `?action=token` added to the end. You should see
   `{"status":"ok","token":"…"}`. Then send yourself a test brief from the website.

## Recommended once

- **Delete old enquiries automatically.** The privacy policy says enquiries are deleted within 12 months.
  In the Apps Script editor, open **Triggers** (clock icon) → **Add trigger**, choose `purgeOldLeads`,
  then **Time-driven** and **Day timer**, and save.
- **Keep the sheet private.** Under **Share**, General access should be **Restricted**. Never use
  "Anyone with the link", because the sheet holds people's contact details.
- **Style the sheet** (optional): select `formatSheet` in the function list and click **Run**.

## Sheet columns

`Timestamp | Name | Email | Phone | Service | Budget | Timeline | Preferred Contact | Message | Reference | Source | Honeypot`

The Honeypot column stays empty now, because the script drops honeypot submissions without saving them.

## The Funnel tab: how many people finish the form

The script also keeps a "Funnel" tab, with one row per day:

`Date | Started | Step 1 done | Step 2 done | Sent`

- **Started:** people who began the form, counted the first time they click into it.
- **Step 1 done:** people who got past "What do you need?".
- **Step 2 done:** people who got past "What should it achieve?".
- **Sent:** briefs that were saved.

To see where people drop off, divide a column by the one before it. For example, Sent ÷ Started is the share of people
who finish. Only totals are stored, with no names, emails or anything that identifies a visitor. Each count stops at
1,000 a day, so nobody can inflate the numbers.

For page views (how many people saw the contact page before starting), use the visitor statistics in Namecheap's cPanel
under **Metrics → Awstats**. They come from the server's own logs and need no cookies.

## Setting it up from scratch

1. Create a Google Sheet, then open **Extensions → Apps Script** and paste in [Code.gs](Code.gs).
   Change `SHEET_ID` to the new sheet's ID (the long code in its URL).
2. **Deploy → New deployment**, choose the type **Web app**, set **Execute as: Me** and
   **Who has access: Anyone**, and click **Deploy**.
3. Copy the web app URL (it ends in `/exec`) into `GOOGLE_SHEETS_ENDPOINT` in [src/config.js](src/config.js).
   Then rebuild and redeploy the site.
