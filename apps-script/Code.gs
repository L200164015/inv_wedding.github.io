/**
 * Wedding RSVP backend — Google Apps Script
 * Sheet: https://docs.google.com/spreadsheets/d/1ThSZIkxWgS1VrJZWCSDOOoCDOHujK3UdVHQRcIbQMJI
 * Columns: Timestamp | Name | Attendance | Guests | Message | Visible
 * Set a row's Visible cell to FALSE to hide that wish from the website.
 */
const SHEET_ID  = "1ThSZIkxWgS1VrJZWCSDOOoCDOHujK3UdVHQRcIbQMJI";
const SHEET_TAB = "RSVP";
const HEADERS   = ["Timestamp","Name","Attendance","Guests","Message","Visible"];

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sh;
}

function clean_(v, max) {
  v = String(v == null ? "" : v).trim().slice(0, max);
  // stop spreadsheet formula injection
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    const name = clean_(d.name, 80);
    if (!name) return json_({ ok: false, error: "name required" });
    getSheet_().appendRow([
      new Date(),
      name,
      d.attendance === "Hadir" ? "Hadir" : "Tidak Hadir",
      Math.max(0, Math.min(10, parseInt(d.guests, 10) || 0)),
      clean_(d.message, 400),
      true
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "wishes") {
    const sh = getSheet_();
    const n = sh.getLastRow() - 1;
    if (n < 1) return json_({ wishes: [] });
    const rows = sh.getRange(2, 1, n, 6).getValues();
    const wishes = rows
      .filter(r => r[4] && r[5] !== false && String(r[5]).toUpperCase() !== "FALSE")
      .map(r => ({ name: r[1], message: r[4], time: r[0] }))
      .reverse()
      .slice(0, 100);
    return json_({ wishes: wishes });
  }
  return json_({ ok: true, service: "wedding-rsvp" });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
