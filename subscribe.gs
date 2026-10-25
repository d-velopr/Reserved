/**
 * Reserved: email sign-up backend
 * =============================================================================
 * Receives the "Get drops first" form on index.html and adds one row per
 * sign-up to a Google Sheet. A repeat email is not added twice.
 *
 * SETUP (once, about 3 minutes)
 * -----------------------------------------------------------------------------
 *  1. Create a Google Sheet, e.g. "Reserved: Subscribers".
 *  2. In that Sheet: Extensions > Apps Script. Delete what's in Code.gs.
 *  3. Paste this whole file in and save.
 *  4. Deploy > New deployment > gear icon > Web app.
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Deploy and approve the permission prompt. Google warns the app is
 *     unverified; that is expected for your own script, so continue.
 *  5. Copy the Web app URL (ends in /exec).
 *  6. Open assets/js/app.js and replace REPLACE_ME_APPS_SCRIPT_URL with it,
 *     keeping the quotes. That is the only edit.
 *  7. Open the /exec URL in a browser: it should show {"status":"ok"}.
 *     Then sign up on the page and check that the row appears in the Sheet.
 *
 * AFTER ANY EDIT to this script: Deploy > Manage deployments > pencil >
 * Version: New version > Deploy. Otherwise the old version keeps running.
 *
 * The page posts with mode "no-cors" and a text/plain JSON body, because Apps
 * Script can't answer a CORS preflight. The browser can't read the reply, so
 * the Sheet and Apps Script > Executions are where to confirm a sign-up landed.
 * =============================================================================
 */

var SHEET_NAME = 'Subscribers';
var HEADERS = ['Timestamp', 'Email', 'Signed Up From', 'Client Timestamp'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = parseRequest_(e);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      return jsonResponse_({ status: 'error', message: 'Invalid email.' });
    }

    lock.waitLock(10000);
    var sheet = getSheet_();

    if (alreadySubscribed_(sheet, data.email)) {
      return jsonResponse_({ status: 'ok', duplicate: true });
    }

    sheet.appendRow([new Date(), data.email, data.page, data.submittedAt]);
    // Save the row before the lock is released. Without this, a quick repeat
    // sign-up can check the Sheet before the row lands and add it twice.
    SpreadsheetApp.flush();
    console.log('Subscriber added: ' + data.email);
    return jsonResponse_({ status: 'ok' });
  } catch (err) {
    console.error('doPost failed: ' + err);
    return jsonResponse_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  return jsonResponse_({ status: 'ok', service: 'Reserved sign-up' });
}

function parseRequest_(e) {
  var raw = {};
  if (e && e.postData && e.postData.contents) {
    try { raw = JSON.parse(e.postData.contents) || {}; } catch (ignored) { raw = {}; }
  }
  if (!raw.email && e && e.parameter) raw = e.parameter;
  return {
    email: clean_(raw.email).toLowerCase(),
    page: clean_(raw.page),
    submittedAt: clean_(raw.submittedAt)
  };
}

/** Trims, caps length, and blocks values that a Sheet would run as a formula. */
function clean_(value) {
  if (value === null || value === undefined) return '';
  var text = String(value).trim();
  if (text.length > 500) text = text.substring(0, 500);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function alreadySubscribed_(sheet, email) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var found = sheet.getRange(2, 2, last - 1, 1)
    .createTextFinder(email).matchEntireCell(true).findNext();
  return found !== null;
}

function getSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
