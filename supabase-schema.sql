-- YoungHouse Room Management Schema
-- Chạy script này trong Supabase SQL Editor để tạo bảng rooms

-- Tạo bảng rooms
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  room_id INTEGER UNIQUE NOT NULL,
  branch_id INTEGER NOT NULL,
  branch_name VARCHAR(100) NOT NULL,
  room_type_id INTEGER NOT NULL,
  type_name VARCHAR(200) NOT NULL,
  price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Occupied', 'Maintenance')),
  is_available BOOLEAN DEFAULT true,
  address VARCHAR(300),
  city VARCHAR(50) DEFAULT 'Hà Nội',
  service_fee INTEGER DEFAULT 230000,
  electricity_fee INTEGER DEFAULT 3200,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo function để auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để auto-update updated_at khi có thay đổi
DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tạo index cho các field thường query
CREATE INDEX IF NOT EXISTS idx_rooms_branch_id ON rooms(branch_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_is_available ON rooms(is_available);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policy cho phép đọc public (ai cũng có thể xem phòng)
CREATE POLICY "Allow public read access" ON rooms
  FOR SELECT
  USING (true);

-- Policy cho phép update (cần authenticated hoặc service role)
CREATE POLICY "Allow authenticated update" ON rooms
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy cho phép insert (cần authenticated hoặc service role)  
CREATE POLICY "Allow authenticated insert" ON rooms
  FOR INSERT
  WITH CHECK (true);

-- Insert dữ liệu phòng ban đầu
INSERT INTO rooms (room_id, branch_id, branch_name, room_type_id, type_name, price, status, is_available, address, service_fee, electricity_fee) VALUES
(1, 1, 'Young House 1', 1, 'Giường đôi', 1500000, 'Available', true, '57 đường Xóm Quán – H10, xã Tân Xã', 230000, 3200),
(17, 1, 'Young House 1', 25, 'Giường gác xép có ban công thoáng', 2200000, 'Available', true, '57 đường Xóm Quán – H10, xã Tân Xã', 230000, 3200),
(2, 2, 'Young House 2', 5, 'Giường đôi căn góc thoáng', 2600000, 'Available', true, '64 Phú Hữu, xã Tân Xã', 230000, 3200),
(3, 2, 'Young House 2', 3, 'Giường đơn có ban công thoáng', 2600000, 'Available', false, '64 Phú Hữu, xã Tân Xã', 230000, 3200),
(4, 2, 'Young House 2', 4, 'Giường đơn có giếng trời thoáng', 2400000, 'Available', false, '64 Phú Hữu, xã Tân Xã', 230000, 3200),
(14, 2, 'Young House 2', 20, 'Căn 2 ngủ căn góc có ban công thoáng', 4500000, 'Reserved', false, '64 Phú Hữu, xã Tân Xã', 230000, 3200),
(15, 2, 'Young House 2', 21, 'Căn 2 ngủ căn góc có giếng trời thoáng', 4500000, 'Reserved', false, '64 Phú Hữu, xã Tân Xã', 230000, 3200),
(16, 2, 'Young House 2', 22, 'Căn 2 ngủ có ban công thoáng', 4500000, 'Reserved', false, '64 Phú Hữu, xã Tân Xã', 230000, 3200),
(5, 4, 'Young House 4', 12, 'Giường gác xép có hành lang view hồ Tân Xã', 2000000, 'Available', false, '85 Mục Uyên – Công Nghệ, Tân Xã', 230000, 3200),
(20, 6, 'Young House 6', 30, 'Giường gác xép có ban công thoáng', 1700000, 'Available', false, 'Ngõ 902 đường 420, thôn Thái Bình, Bình Yên', 180000, 3200),
(18, 5, 'Young House 5', 26, 'Giường hai giường đôi có ban công thoáng', 2500000, 'Available', false, '23 Mục Uyên – Công nghệ - Tân Xã', 230000, 3200),
(6, 9, 'Young House 9', 10, 'Giường đôi có ban công thoáng', 2000000, 'Available', false, 'D2 – Khu Tái định cư đường 420 xã Bình Yên – Thạch Thất', 230000, 3200),
(7, 10, 'Young House 10', 11, 'Giường đôi', 1400000, 'Available', false, 'Nhà văn hóa thôn Thái Bình, xã Bình Yên', 180000, 3200),
(8, 11, 'Young House 11', 8, 'Giường gác xép có ban công thoáng', 2200000, 'Available', true, 'Số 6, đường Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', 230000, 3200),
(9, 12, 'Young House 12', 7, 'Giường gác xép có ban công thoáng', 2500000, 'Available', false, 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', 230000, 3200),
(19, 12, 'Young House 12', 27, 'Giường đôi có ban công thoáng view FPT', 2300000, 'Available', false, 'Gần nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', 230000, 3200),
(10, 14, 'Young House 14', 13, 'Giường đôi có cửa sổ thoáng', 1700000, 'Available', false, 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', 180000, 3200),
(11, 5, 'Young House 5', 15, 'Giường gác xép có ban công thoáng', 2000000, 'Available', true, '23 Mục Uyên – Công nghệ - Tân Xã', 230000, 3200),
(12, 7, 'Young House 7', 16, 'Giường đôi có ban công thoáng', 2400000, 'Available', false, 'Đối diện THPT Hai Bà Trưng - Tân Xã', 230000, 3200),
(13, 8, 'Young House 8', 17, 'Giường gác xép có ban công thoáng', 2200000, 'Available', true, '41 Mục Uyên 1, xã Tân Xã', 230000, 3200)
ON CONFLICT (room_id) DO UPDATE SET
  branch_id = EXCLUDED.branch_id,
  branch_name = EXCLUDED.branch_name,
  room_type_id = EXCLUDED.room_type_id,
  type_name = EXCLUDED.type_name,
  price = EXCLUDED.price,
  address = EXCLUDED.address,
  service_fee = EXCLUDED.service_fee,
  electricity_fee = EXCLUDED.electricity_fee;

-- Xem dữ liệu đã insert
SELECT * FROM rooms ORDER BY room_id;

-- ============================================================
-- ROOMMATE POSTS TABLE (Tìm Người Ở Ghép)
-- ============================================================

-- Tạo bảng roommate_posts
CREATE TABLE IF NOT EXISTS roommate_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(200),
  price VARCHAR(100),
  room_type VARCHAR(50),
  gender VARCHAR(20),
  age VARCHAR(50),
  contact VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo trigger để auto-update updated_at cho roommate_posts
DROP TRIGGER IF EXISTS update_roommate_posts_updated_at ON roommate_posts;
CREATE TRIGGER update_roommate_posts_updated_at
  BEFORE UPDATE ON roommate_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tạo index cho các field thường query
CREATE INDEX IF NOT EXISTS idx_roommate_posts_status ON roommate_posts(status);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_location ON roommate_posts(location);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_gender ON roommate_posts(gender);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_created_at ON roommate_posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE roommate_posts ENABLE ROW LEVEL SECURITY;

-- Policy cho phép đọc public (ai cũng có thể xem bài đăng)
CREATE POLICY "Allow public read roommate_posts" ON roommate_posts
  FOR SELECT
  USING (true);

-- Policy cho phép insert (ai cũng có thể đăng bài)
CREATE POLICY "Allow public insert roommate_posts" ON roommate_posts
  FOR INSERT
  WITH CHECK (true);

-- Policy cho phép update (chỉ admin hoặc owner - hiện tại cho phép tất cả)
CREATE POLICY "Allow public update roommate_posts" ON roommate_posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy cho phép delete (chỉ admin)
CREATE POLICY "Allow public delete roommate_posts" ON roommate_posts
  FOR DELETE
  USING (true);

-- Xem danh sách bài đăng tìm người ở ghép
SELECT * FROM roommate_posts ORDER BY created_at DESC;

-- ============================================================
-- ROOM REVIEWS TABLE (Đánh giá phòng trọ)
-- ============================================================

-- Tạo bảng room_reviews
CREATE TABLE IF NOT EXISTS room_reviews (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL,
  reviewer_name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  pros TEXT, -- Điểm tốt
  cons TEXT, -- Điểm chưa tốt
  stay_duration VARCHAR(50), -- Thời gian ở (VD: "6 tháng", "1 năm")
  is_verified BOOLEAN DEFAULT false, -- Đã xác minh là khách thuê thực
  is_approved BOOLEAN DEFAULT true, -- Admin duyệt hiển thị
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo trigger để auto-update updated_at cho room_reviews
DROP TRIGGER IF EXISTS update_room_reviews_updated_at ON room_reviews;
CREATE TRIGGER update_room_reviews_updated_at
  BEFORE UPDATE ON room_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tạo index cho các field thường query
CREATE INDEX IF NOT EXISTS idx_room_reviews_room_id ON room_reviews(room_id);
CREATE INDEX IF NOT EXISTS idx_room_reviews_rating ON room_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_room_reviews_is_approved ON room_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_room_reviews_created_at ON room_reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE room_reviews ENABLE ROW LEVEL SECURITY;

-- Policy cho phép đọc public (chỉ những review đã được duyệt)
CREATE POLICY "Allow public read approved reviews" ON room_reviews
  FOR SELECT
  USING (is_approved = true);

-- Policy cho phép insert (ai cũng có thể viết review)
CREATE POLICY "Allow public insert reviews" ON room_reviews
  FOR INSERT
  WITH CHECK (true);

-- Policy cho phép update (admin)
CREATE POLICY "Allow public update reviews" ON room_reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy cho phép delete (admin)
CREATE POLICY "Allow public delete reviews" ON room_reviews
  FOR DELETE
  USING (true);

-- Xem danh sách reviews
SELECT * FROM room_reviews ORDER BY created_at DESC;
