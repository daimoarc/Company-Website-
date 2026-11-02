// Google Apps Script Web App URL that appends form submissions to a Google Sheet.
// See SHEETS_SETUP.md in the project root for the 5-minute setup steps.
// Verified working end-to-end (anonymous POST returns {status:"ok",submitted:true}
// and writes to the "Leads" tab of the "Daimoarc Leads" spreadsheet) as of 2026-09-15.
export const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxUU-WB8KbJGmodHzOtLekKUL7v9rHZJ-egi38B1k9jcpNWYoi6_ZPk1PRPxqY2SxrO7g/exec'

export const CONTACT_EMAIL = 'daimoarc@gmail.com'
