# Chức Năng Tìm Người Ở Ghép

## Tổng Quan

Chức năng tìm người ở ghép được tích hợp vào ứng dụng YoungHouse, cho phép người dùng:
- Xem danh sách các bài đăng tìm người ở ghép
- Tạo bài đăng mới để tìm người ở ghép
- Lọc và tìm kiếm bài đăng theo các tiêu chí khác nhau
- Liên hệ trực tiếp với người đăng bài

## Công Nghệ Sử Dụng

### Frontend
- **React TypeScript**: Framework chính
- **CSS Grid & Flexbox**: Layout responsive
- **Google Apps Script**: Backend API và database

### Backend
- **Google Sheets**: Database lưu trữ dữ liệu
- **Google Apps Script**: API endpoints
- **Deployment ID**: `AKfycbw4Sl55z3F3OLd7pD0b7z4to3lqkmOwmLFeFODxomzvtTdBxiIz5TXnV0zVWfJ3OGzv`

## Cấu Trúc Dữ Liệu

### RoommatePost Interface
```typescript
interface RoommatePost {
  id: number;
  title: string;
  description: string;
  location: string;
  price: string;
  roomType: string;
  gender: string;
  age: string;
  contact: string;
  createdAt: string;
  status: string;
}
```

### Google Sheets Structure
| Cột | Tên | Mô tả |
|-----|-----|-------|
| A | id | ID tự động tăng |
| B | title | Tiêu đề bài đăng |
| C | description | Mô tả chi tiết |
| D | location | Địa điểm |
| E | price | Giá phòng |
| F | roomType | Loại phòng |
| G | gender | Yêu cầu giới tính |
| H | age | Độ tuổi mong muốn |
| I | contact | Thông tin liên hệ |
| J | createdAt | Ngày tạo |
| K | status | Trạng thái (active/inactive) |

## API Endpoints

### 1. Lấy Danh Sách Bài Đăng
```
GET https://script.google.com/macros/s/AKfycbw4Sl55z3F3OLd7pD0b7z4to3lqkmOwmLFeFODxomzvtTdBxiIz5TXnV0zVWfJ3OGzv/exec
```

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Cần tìm 1 bạn nữ ở ghép",
      "description": "Phòng rộng 25m2, full nội thất",
      "location": "Tân Xã",
      "price": "2tr/người",
      "roomType": "Phòng đôi",
      "gender": "Nữ",
      "age": "20-25",
      "contact": "0987xxxxxx",
      "createdAt": "8/20/2025",
      "status": "active"
    }
  ]
}
```

### 2. Tạo Bài Đăng Mới
```
POST https://script.google.com/macros/s/AKfycbw4Sl55z3F3OLd7pD0b7z4to3lqkmOwmLFeFODxomzvtTdBxiIz5TXnV0zVWfJ3OGzv/exec
```

**Parameters:**
- `token`: SECRET_TOKEN (4410desk35)
- `title`: Tiêu đề bài đăng (bắt buộc)
- `description`: Mô tả chi tiết (bắt buộc)
- `contact`: Thông tin liên hệ (bắt buộc)
- `location`: Địa điểm (tùy chọn)
- `price`: Giá phòng (tùy chọn)
- `roomType`: Loại phòng (tùy chọn)
- `gender`: Yêu cầu giới tính (tùy chọn)
- `age`: Độ tuổi mong muốn (tùy chọn)
- `status`: Trạng thái (mặc định: active)

**Response:**
```json
{
  "ok": true,
  "id": 2
}
```

## Cách Sử Dụng

### 1. Truy Cập Chức Năng
- Vào menu "Tìm người ở ghép" trên navbar
- Hoặc truy cập trực tiếp: `/roommate-finder`

### 2. Xem Danh Sách Bài Đăng
- Mặc định hiển thị danh sách tất cả bài đăng
- Sử dụng bộ lọc để tìm kiếm theo:
  - Địa điểm
  - Loại phòng
  - Giới tính
  - Giá
  - Trạng thái

### 3. Tạo Bài Đăng Mới
- Click nút "Đăng Bài Mới"
- Điền thông tin bắt buộc:
  - Tiêu đề bài đăng
  - Mô tả chi tiết
  - Thông tin liên hệ
- Điền thông tin tùy chọn khác
- Click "Đăng bài" để hoàn tất

### 4. Xem Chi Tiết Bài Đăng
- Click vào bất kỳ bài đăng nào trong danh sách
- Modal sẽ hiển thị thông tin chi tiết
- Có thể liên hệ trực tiếp qua nút "Liên hệ ngay"

## Tính Năng Nổi Bật

### 1. Bộ Lọc Thông Minh
- Lọc theo địa điểm
- Lọc theo loại phòng (đơn, đôi, ba, tư)
- Lọc theo yêu cầu giới tính
- Lọc theo khoảng giá
- Lọc theo trạng thái bài đăng

### 2. Giao Diện Responsive
- Tối ưu cho desktop, tablet, mobile
- Thiết kế hiện đại với animations
- Dễ sử dụng trên mọi thiết bị

### 3. Tương Tác Trực Tiếp
- Liên hệ ngay qua điện thoại/email
- Không cần đăng ký tài khoản
- Thông tin được hiển thị rõ ràng

### 4. Bảo Mật
- Token xác thực cho API
- Validation dữ liệu đầu vào
- Kiểm soát quyền truy cập

## Cấu Hình Google Apps Script

### 1. Tạo Google Sheet
- Tạo Google Sheet mới
- Đặt tên các cột theo cấu trúc đã định
- Thêm dữ liệu mẫu

### 2. Tạo Apps Script
- Mở Google Sheet
- Vào Extensions > Apps Script
- Copy code từ file `google-apps-script.js`

### 3. Deploy
- Click "Deploy" > "New deployment"
- Chọn "Web app"
- Set access: "Anyone"
- Copy Deployment ID

### 4. Cập Nhật Frontend
- Thay đổi `GOOGLE_APPS_SCRIPT_URL` trong `roommateService.ts`
- Thay đổi `SECRET_TOKEN` nếu cần

## Troubleshooting

### 1. Lỗi CORS
- Đảm bảo Google Apps Script đã deploy đúng
- Kiểm tra URL deployment

### 2. Lỗi 401 Unauthorized
- Kiểm tra SECRET_TOKEN
- Đảm bảo token được gửi đúng format

### 3. Dữ Liệu Không Hiển Thị
- Kiểm tra cấu trúc Google Sheet
- Đảm bảo có dữ liệu trong sheet
- Kiểm tra console log

### 4. Không Tạo Được Bài Đăng
- Kiểm tra các field bắt buộc
- Đảm bảo internet connection
- Kiểm tra quyền ghi vào Google Sheet

## Phát Triển Tương Lai

### 1. Tính Năng Có Thể Thêm
- Upload hình ảnh phòng
- Đánh giá và bình luận
- Thông báo real-time
- Chat trực tiếp
- Báo cáo bài đăng spam

### 2. Cải Thiện Hiện Tại
- Pagination cho danh sách dài
- Search theo từ khóa
- Sort theo ngày đăng, giá
- Export dữ liệu
- Admin panel quản lý

### 3. Tối Ưu Hóa
- Caching dữ liệu
- Lazy loading
- Progressive Web App
- Push notifications

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề hoặc cần hỗ trợ:
- Email: support@younghouse.com
- Phone: 0372858098
- Zalo: 0372858098


