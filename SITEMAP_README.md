# Sitemap Generation

## Tổng quan
Sitemap được tự động tạo từ dữ liệu phòng trong ứng dụng Young House.

## Cấu trúc URL
Mỗi phòng có URL theo format:
```
https://younghousehoalac.com/room/{branch-slug}-{type-slug}-{room-id}
```

### Ví dụ:
- `https://younghousehoalac.com/room/young-house-1-giuong-oi-001`
- `https://younghousehoalac.com/room/young-house-5-giuong-oi-co-ban-cong-thoang-011`
- `https://younghousehoalac.com/room/young-house-5-giuong-hai-giuong-oi-co-ban-cong-thoang-018`

## Cách sử dụng

### 1. Tạo sitemap thủ công
```bash
node scripts/generate-sitemap.mjs
```

### 2. Tự động tạo khi build
Sitemap sẽ được tự động tạo trước mỗi lần build:
```bash
npm run build
```

### 3. Cập nhật dữ liệu phòng
Để thêm phòng mới vào sitemap, cập nhật mảng `localRooms` trong file `scripts/generate-sitemap.mjs`.

## Cấu trúc sitemap

### Trang chính (Priority 1.0)
- Trang chủ: `https://younghousehoalac.com/`

### Trang phụ (Priority 0.8)
- System Home: `https://younghousehoalac.com/system-home`
- Contact: `https://younghousehoalac.com/contact`

### Trang phòng (Priority 0.7)
- Tất cả 40 phòng từ các chi nhánh Young House

## Lưu ý
- Sitemap được lưu tại `public/sitemap.xml`
- Tự động cập nhật khi có thay đổi dữ liệu phòng
- Hỗ trợ SEO tốt với cấu trúc URL rõ ràng
- Tương thích với Google Search Console
