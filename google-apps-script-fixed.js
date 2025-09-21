const SECRET_TOKEN = '4410desk35';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function doGet(e) {
  // Thêm CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    // Nếu có token, tạo bài đăng mới
    if (e.parameter && e.parameter.token) {
      return createPost(e, headers);
    }
    
    // Nếu không có token, lấy danh sách bài đăng
    return getPosts(headers);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doPost(e) {
  // Redirect POST to GET for simplicity
  return doGet(e);
}

function getPosts(headers) {
  try {
    const sheet = getSheet();
    const values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, data: [] }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    const headers_row = values.shift();
    const rows = values.map(r => {
      const obj = {};
      headers_row.forEach((header, index) => {
        obj[header] = r[index];
      });
      return obj;
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, data: rows }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function createPost(e, headers) {
  try {
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    const { title, description, location, price, roomType, gender, age, contact, status } = e.parameter;

    if (!title || !description || !contact) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Missing required fields (title, description, contact)' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
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
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}
















