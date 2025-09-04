const SECRET_TOKEN = '4410desk35';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function doGet(e) {
  // Nếu có token, tạo bài đăng mới
  if (e.parameter && e.parameter.token) {
    return createPost(e);
  }
  
  // Nếu không có token, lấy danh sách bài đăng
  return getPosts();
}

function getPosts() {
  try {
    const sheet = getSheet();
    const values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const headers = values.shift();
    const rows = values.map(r => Object.fromEntries(r.map((v, i) => [headers[i], v])));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, data: rows }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createPost(e) {
  try {
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const { title, description, location, price, roomType, gender, age, contact, status } = e.parameter;

    if (!title || !description || !contact) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const newId = lastRow;
    const createdAt = new Date();

    sheet.appendRow([
      newId,
      title,
      description,
      location || '',
      price || '',
      roomType || '',
      gender || '',
      age || '',
      contact,
      createdAt,
      status || 'active'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, id: newId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}







