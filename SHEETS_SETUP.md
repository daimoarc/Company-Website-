# Connect the "Project Inquiry" form to Google Sheets

The contact form on `/contact` needs a Google Apps Script Web App URL to send
submissions to. Takes about 5 minutes, no coding needed beyond pasting the
script below.

## 1. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like "DaimoArc Inquiries".
3. In row 1, add these column headers (must match order used by the script):
   `Timestamp | Name | Email | Phone | Company | Service | Budget | Timeframe | Details`

## 2. Add the script

1. In the sheet, go to **Extensions → Apps Script**.
2. Delete any starter code in `Code.gs` and paste this in:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.service || '',
    data.budget || '',
    data.timeframe || '',
    data.details || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (disk icon), name the project e.g. "Inquiry Intake".

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy**. Google will ask you to authorize the script — approve it
   (it's your own script, this is expected).
5. Copy the **Web app URL** it gives you (ends in `/exec`).

## 4. Connect it to the site

Open [src/config.js](src/config.js) and paste the URL:

```javascript
export const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXXXXXX/exec'
```

Save, redeploy the site, and submit the form once yourself to confirm a row
appears in the sheet.

## Notes

- If you ever edit the script after deploying, you must create a **new
  deployment** (or use "Manage deployments → Edit → New version") for changes
  to take effect — editing the code alone does not update the live URL.
- The sheet is private to your Google account by default; share it with
  teammates via the normal Google Sheets "Share" button.
- Anyone with the `/exec` URL can technically POST to it — this is normal for
  this kind of setup, but don't publish the URL publicly anywhere.
