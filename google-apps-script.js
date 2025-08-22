const SECRET_TOKEN = '4410desk35'; // đổi thành token bí mật của bạn

// Hàm lấy sheet đầu tiên trong file (tránh lỗi sai tên tab)
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// Hàm trả JSON
function _json(obj, status = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm xử lý GET request - lấy danh sách bài đăng
function doGet(e) {
  // Nếu có parameter token, xử lý như POST request
  if (e.parameter && e.parameter.token) {
    return doPost(e);
  }
  
  // Nếu không có token, lấy danh sách bài đăng
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values.shift(); // lấy row header
  const rows = values.map(r => Object.fromEntries(r.map((v, i) => [headers[i], v])));

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm xử lý POST request - tạo bài đăng mới
function doPost(e) {
  try {
    const token = (e.parameter && e.parameter.token) || '';
    if (token !== SECRET_TOKEN) {
      return _json({ ok: false, error: 'Unauthorized' }, 401);
    }

    // Lấy dữ liệu từ parameters
    const { title, description, location, price, roomType, gender, age, contact, status } = e.parameter;

    if (!title || !description || !contact) {
      return _json({ ok: false, error: 'Missing required fields (title, description, contact)' }, 400);
    }

    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const newId = lastRow; // ID = số dòng
    const createdAt = new Date();

    // Ghi vào sheet theo đúng thứ tự cột
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

    return _json({ ok: true, id: newId });
  } catch (error) {
    return _json({ ok: false, error: error.toString() }, 500);
  }
}
