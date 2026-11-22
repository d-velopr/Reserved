/**
 * Reserved: email sign-up backend
 * =============================================================================
 * Receives sign-ups from index.html (the email + ZIP step of the entry gate,
 * and the Subscribe form) and adds one row per sign-up to a Google Sheet.
 * A repeat email is not added twice; if the first row has no ZIP code yet,
 * the ZIP from the repeat sign-up is filled in.
 *
 * Also receives messages from contact.html (kind: "contact") and adds them to
 * a separate "Messages" tab. A message never adds anyone to the sign-up list.
 * The contact form sends its email as "from", not "email", so an older
 * deployment of this script rejects it instead of adding it as a sign-up.
 *
 * Also receives Carry Us requests from carry-us.html (kind: "carry", email sent
 * as "from" for the same reason) and adds them to a "Carry Us" tab. Files
 * attached to a request are saved to a private Google Drive folder,
 * "Reserved Carry Us Attachments", and linked from the row. The first deploy
 * after this was added asks for Google Drive permission; approve it.
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

// Shown when the /exec URL is opened in a browser. If it doesn't say this,
// the live deployment is still running older code.
var VERSION = 'carry-3';
var SHEET_NAME = 'Subscribers';
// New columns go at the end so rows saved before they existed stay lined up.
var HEADERS = ['Timestamp', 'Email', 'Signed Up From', 'Client Timestamp', 'ZIP Code', 'Source'];
var ZIP_COL = 5;
var MESSAGES_SHEET = 'Messages';
// License # moved to the Carry Us form; the column stays (blank on new rows) so
// older messages keep lining up.
var MESSAGE_HEADERS = ['Timestamp', 'Name', 'Email', 'License #', 'Message', 'Sent From', 'Phone'];
var MESSAGE_PHONE_COL = 7;
var CARRY_SHEET = 'Carry Us';
var CARRY_HEADERS = ['Timestamp', 'How Can We Help', 'Name', 'Email', 'Phone', 'State', 'Dispensary', 'License #', 'Message', 'Contact By', 'License Documents', 'Sent From'];
var CARRY_PHONE_COL = 5;
var CARRY_FOLDER = 'Reserved Carry Us Attachments';
var CARRY_MAX_FILES = 5;
var CARRY_MAX_BYTES = 10 * 1024 * 1024; // 10 MB in all, same as the page

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = parseRequest_(e);
    if (data.kind === 'contact') return saveMessage_(data, lock);
    if (data.kind === 'carry') return saveCarry_(data, lock);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      return jsonResponse_({ status: 'error', message: 'Invalid email.' });
    }
    if (data.zip && !/^\d{5}$/.test(data.zip)) {
      return jsonResponse_({ status: 'error', message: 'Invalid ZIP code.' });
    }

    lock.waitLock(10000);
    var sheet = getSheet_();

    var row = findSubscriber_(sheet, data.email);
    if (row) {
      var zipCell = sheet.getRange(row, ZIP_COL);
      if (data.zip && !zipCell.getValue()) {
        // Text format keeps leading zeros (e.g. 01234).
        zipCell.setNumberFormat('@').setValue(data.zip);
        SpreadsheetApp.flush();
      }
      return jsonResponse_({ status: 'ok', duplicate: true });
    }

    sheet.appendRow([new Date(), data.email, data.page, data.submittedAt, '', data.source]);
    var last = sheet.getLastRow();
    if (data.zip) sheet.getRange(last, ZIP_COL).setNumberFormat('@').setValue(data.zip);
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

/**
 * Run this once from the editor (pick it in the function menu, then Run) to
 * give the script Google Drive access for Carry Us license documents. On the
 * permission screen, tick every box (or "Select all"): uploads need full Drive
 * access, not just viewing. It makes the "Reserved Carry Us Attachments"
 * folder if it isn't there yet, and logs its link.
 */
function authorizeDrive() {
  var folders = DriveApp.getFoldersByName(CARRY_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CARRY_FOLDER);
  console.log('Drive access OK. License documents go to: ' + folder.getUrl());
}

/** Open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  return jsonResponse_({ status: 'ok', service: 'Reserved sign-up', version: VERSION });
}

function parseRequest_(e) {
  var raw = {};
  if (e && e.postData && e.postData.contents) {
    try { raw = JSON.parse(e.postData.contents) || {}; } catch (ignored) { raw = {}; }
  }
  // Form-encoded fallback only. A JSON POST still has an (empty) e.parameter,
  // so checking just for a missing email threw away contact and Carry Us
  // posts, which send "from" instead of "email".
  if (!raw.email && !raw.from && e && e.parameter && (e.parameter.email || e.parameter.from)) raw = e.parameter;
  return {
    email: clean_(raw.email).toLowerCase(),
    zip: clean_(raw.zip),
    source: clean_(raw.source),
    page: clean_(raw.page),
    submittedAt: clean_(raw.submittedAt),
    // Contact form
    kind: clean_(raw.kind),
    name: clean_(raw.name, 100),
    from: clean_(raw.from).toLowerCase(),
    license: clean_(raw.license, 40),
    message: clean_(raw.message, 2000),
    // Carry Us form
    topic: clean_(raw.topic, 100),
    phone: clean_(raw.phone, 15).replace(/\D/g, ''),
    state: clean_(raw.state, 40),
    dispensary: clean_(raw.dispensary, 120),
    via: clean_(raw.via, 60),
    attachments: Array.isArray(raw.attachments) ? raw.attachments.slice(0, CARRY_MAX_FILES) : []
  };
}

/** Adds one contact-form message to the Messages tab. */
function saveMessage_(data, lock) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.from)) {
    return jsonResponse_({ status: 'error', message: 'Invalid email.' });
  }
  if (!data.name || !data.message) {
    return jsonResponse_({ status: 'error', message: 'Name and message are required.' });
  }
  if (data.phone && !/^\d{10}$/.test(data.phone)) { // optional
    return jsonResponse_({ status: 'error', message: 'Invalid phone.' });
  }
  lock.waitLock(10000);
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(MESSAGES_SHEET);
  if (!sheet) {
    sheet = book.insertSheet(MESSAGES_SHEET);
    sheet.appendRow(MESSAGE_HEADERS);
    sheet.getRange(1, 1, 1, MESSAGE_HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else if (!sheet.getRange(1, MESSAGE_PHONE_COL).getValue()) {
    // A Messages tab made before the Phone column existed: add its header.
    sheet.getRange(1, MESSAGE_PHONE_COL).setValue('Phone').setFontWeight('bold');
  }
  sheet.appendRow([new Date(), data.name, data.from, '', data.message, data.page, '']);
  var p = data.phone; // optional; shown as +1 (201)987-0123, as text so the Sheet keeps it as typed
  if (p) {
    sheet.getRange(sheet.getLastRow(), MESSAGE_PHONE_COL).setNumberFormat('@')
      .setValue('+1 (' + p.slice(0, 3) + ')' + p.slice(3, 6) + '-' + p.slice(6));
  }
  SpreadsheetApp.flush();
  console.log('Message from: ' + data.from);
  return jsonResponse_({ status: 'ok' });
}

/** Adds one Carry Us request to the Carry Us tab; attachments go to Drive. */
function saveCarry_(data, lock) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.from)) {
    return jsonResponse_({ status: 'error', message: 'Invalid email.' });
  }
  if (!/^\d{10}$/.test(data.phone)) {
    return jsonResponse_({ status: 'error', message: 'Invalid phone.' });
  }
  if (!data.name || !data.state || !data.dispensary || !data.license || !data.message) {
    return jsonResponse_({ status: 'error', message: 'Name, state, dispensary, license # and message are required.' });
  }
  if (!data.attachments.length) {
    return jsonResponse_({ status: 'error', message: 'License documents are required.' });
  }
  // Save the files first (outside the lock: uploads can take a few seconds).
  // If Drive fails (e.g. Drive access not approved), the request still saves,
  // with the reason in the License Documents column, so no shop is lost.
  var links;
  try {
    links = saveAttachments_(data);
  } catch (err) {
    console.error('Attachment upload failed: ' + err);
    links = [data.attachments.length + ' file(s) not saved: ' + String(err).substring(0, 200)];
  }
  lock.waitLock(10000);
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(CARRY_SHEET);
  if (!sheet) {
    sheet = book.insertSheet(CARRY_SHEET);
    sheet.appendRow(CARRY_HEADERS);
    sheet.getRange(1, 1, 1, CARRY_HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([new Date(), data.topic, data.name, data.from, '', data.state, data.dispensary,
    data.license, data.message, data.via, links.join('\n'), data.page]);
  // Shown as the page shows it, e.g. +1 (201)987-0123. Text format stops the
  // Sheet turning it into a number or a formula.
  var p = data.phone;
  sheet.getRange(sheet.getLastRow(), CARRY_PHONE_COL).setNumberFormat('@')
    .setValue('+1 (' + p.slice(0, 3) + ')' + p.slice(3, 6) + '-' + p.slice(6));
  SpreadsheetApp.flush();
  console.log('Carry Us request from: ' + data.from + ' (' + links.length + ' files)');
  return jsonResponse_({ status: 'ok' });
}

/**
 * Saves a request's attachments (images and PDFs only, 10 MB in all) to the
 * Drive folder and returns their links. Files stay private to the Sheet's
 * owner. Anything that isn't an image or PDF, or goes over the size limit,
 * is skipped.
 */
function saveAttachments_(data) {
  var links = [];
  if (!data.attachments.length) return links;
  var folders = DriveApp.getFoldersByName(CARRY_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CARRY_FOLDER);
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HHmm');
  var who = (data.dispensary || data.name).replace(/[^\w .-]/g, '').substring(0, 40);
  var total = 0;
  data.attachments.forEach(function (f) {
    if (!f || typeof f.data !== 'string') return;
    var type = String(f.type || '');
    if (!/^image\//.test(type) && type !== 'application/pdf') return;
    var bytes;
    try { bytes = Utilities.base64Decode(f.data); } catch (err) { return; }
    total += bytes.length;
    if (total > CARRY_MAX_BYTES) return;
    var name = String(f.name || 'file').replace(/[\\/:*?"<>|]/g, '').substring(0, 80);
    var file = folder.createFile(Utilities.newBlob(bytes, type, stamp + ' ' + who + ' - ' + name));
    links.push(file.getUrl());
  });
  return links;
}

/** Trims, caps length (500 by default), and blocks values a Sheet would run as a formula. */
function clean_(value, max) {
  if (value === null || value === undefined) return '';
  var text = String(value).trim();
  max = max || 500;
  if (text.length > max) text = text.substring(0, max);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

/** Returns the row number of an existing sign-up for this email, or 0. */
function findSubscriber_(sheet, email) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var found = sheet.getRange(2, 2, last - 1, 1)
    .createTextFinder(email).matchEntireCell(true).findNext();
  return found ? found.getRow() : 0;
}

function getSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    // Older Sheets may be missing the newer headers. Fill in only the blank
    // header cells, so headers someone renamed (e.g. "EMAIL ADDRESS") stay.
    var top = sheet.getRange(1, 1, 1, HEADERS.length);
    var current = top.getValues()[0];
    var changed = false;
    for (var i = 0; i < HEADERS.length; i++) {
      if (current[i] === '' || current[i] === null) { current[i] = HEADERS[i]; changed = true; }
    }
    if (changed) top.setValues([current]).setFontWeight('bold');
  }
  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
