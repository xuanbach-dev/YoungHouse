import fs from 'fs';
import path from 'path';

// Dữ liệu phòng từ SystemHome.tsx
const localRooms = [
  { RoomID: 1, BranchName: 'Young House 1', TypeName: 'Giường đôi', BranchID: 1 },
  { RoomID: 2, BranchName: 'Young House 2', TypeName: 'Giường đôi căn góc thoáng', BranchID: 2 },
  { RoomID: 3, BranchName: 'Young House 2', TypeName: '2 giường đơn có ban công', BranchID: 2 },
  { RoomID: 4, BranchName: 'Young House 2', TypeName: '2 giường đơn có giếng trời', BranchID: 2 },
  { RoomID: 5, BranchName: 'Young House 2', TypeName: 'Giường đôi có ban công thoáng', BranchID: 2 },
  { RoomID: 6, BranchName: 'Young House 2', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 2 },
  { RoomID: 7, BranchName: 'Young House 2', TypeName: 'Giường gác xép có cửa sổ thoáng', BranchID: 2 },
  { RoomID: 8, BranchName: 'Young House 2', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 2 },
  { RoomID: 9, BranchName: 'Young House 2', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 2 },
  { RoomID: 10, BranchName: 'Young House 2', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 2 },
  { RoomID: 11, BranchName: 'Young House 5', TypeName: 'Giường đôi có ban công thoáng', BranchID: 5 },
  { RoomID: 12, BranchName: 'Young House 4', TypeName: 'Giường đôi có hành lang view hồ Tân Xã', BranchID: 4 },
  { RoomID: 13, BranchName: 'Young House 4', TypeName: 'Giường đôi có hành lang view hồ Tân Xã', BranchID: 4 },
  { RoomID: 14, BranchName: 'Young House 4', TypeName: 'Giường đôi có hành lang view hồ Tân Xã', BranchID: 4 },
  { RoomID: 15, BranchName: 'Young House 4', TypeName: 'Giường đôi có hành lang view hồ Tân Xã', BranchID: 4 },
  { RoomID: 16, BranchName: 'Young House 4', TypeName: 'Giường đôi có hành lang view hồ Tân Xã', BranchID: 4 },
  { RoomID: 17, BranchName: 'Young House 1', TypeName: 'Giường đôi', BranchID: 1 },
  { RoomID: 18, BranchName: 'Young House 5', TypeName: 'Giường hai giường đôi có ban công thoáng', BranchID: 5 },
  { RoomID: 19, BranchName: 'Young House 12', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 12 },
  { RoomID: 20, BranchName: 'Young House 7', TypeName: 'Giường đôi có ban công thoáng', BranchID: 7 },
  { RoomID: 21, BranchName: 'Young House 7', TypeName: 'Giường đôi có ban công thoáng', BranchID: 7 },
  { RoomID: 22, BranchName: 'Young House 7', TypeName: 'Giường đôi có ban công thoáng', BranchID: 7 },
  { RoomID: 23, BranchName: 'Young House 8', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 8 },
  { RoomID: 24, BranchName: 'Young House 8', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 8 },
  { RoomID: 25, BranchName: 'Young House 8', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 8 },
  { RoomID: 26, BranchName: 'Young House 9', TypeName: 'Giường đôi có ban công thoáng', BranchID: 9 },
  { RoomID: 27, BranchName: 'Young House 9', TypeName: 'Giường đôi có ban công thoáng', BranchID: 9 },
  { RoomID: 28, BranchName: 'Young House 9', TypeName: 'Giường đôi có ban công thoáng', BranchID: 9 },
  { RoomID: 29, BranchName: 'Young House 10', TypeName: 'Giường đôi', BranchID: 10 },
  { RoomID: 30, BranchName: 'Young House 10', TypeName: 'Giường đôi', BranchID: 10 },
  { RoomID: 31, RoomID: 31, BranchName: 'Young House 11', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 11 },
  { RoomID: 32, RoomID: 32, BranchName: 'Young House 11', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 11 },
  { RoomID: 33, RoomID: 33, BranchName: 'Young House 11', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 11 },
  { RoomID: 34, RoomID: 34, BranchName: 'Young House 12', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 12 },
  { RoomID: 35, RoomID: 35, BranchName: 'Young House 12', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 12 },
  { RoomID: 36, RoomID: 36, BranchName: 'Young House 12', TypeName: 'Giường gác xép có ban công thoáng', BranchID: 12 },
  { RoomID: 37, RoomID: 37, BranchName: 'Young House 14', TypeName: 'Giường gác xép có cửa sổ thoáng', BranchID: 14 },
  { RoomID: 38, RoomID: 38, BranchName: 'Young House 14', TypeName: 'Giường gác xép có cửa sổ thoáng', BranchID: 14 },
  { RoomID: 39, RoomID: 39, BranchName: 'Young House 14', TypeName: 'Giường gác xép có cửa sổ thoáng', BranchID: 14 },
  { RoomID: 40, RoomID: 40, BranchName: 'Young House 14', TypeName: 'Giường gác xép có cửa sổ thoáng', BranchID: 14 }
];

// Hàm tạo slug từ tên phòng
function toSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Hàm tạo URL cho phòng
function buildRoomUrl(room) {
  const branchSlug = toSlug(room.BranchName);
  const typeSlug = toSlug(room.TypeName);
  const roomNumber = room.RoomID.toString().padStart(3, '0');
  return `https://younghousehoalac.com/room/${branchSlug}-${typeSlug}-${roomNumber}`;
}

// Tạo XML sitemap
function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://younghousehoalac.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://younghousehoalac.com/system-home</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://younghousehoalac.com/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://younghousehoalac.com/contact</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Thêm tất cả các phòng
  localRooms.forEach(room => {
    const url = buildRoomUrl(room);
    sitemap += `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Ghi sitemap
const sitemapContent = generateSitemap();
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

console.log('✅ Sitemap đã được cập nhật thành công!');
console.log(`📄 Đã thêm ${localRooms.length} phòng vào sitemap`);
console.log('🔗 Một số URL mẫu:');
localRooms.slice(0, 5).forEach(room => {
  console.log(`   - ${buildRoomUrl(room)}`);
});
