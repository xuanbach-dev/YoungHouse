import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Basic routes
const routes = ['/', '/system-home', '/roommate-finder', '/contact'];

// Minimal room data to include popular slugs
const rooms = [
  { branch: 'Young House 1', type: 'Giường đôi', number: '101' },
  { branch: 'Young House 2', type: 'Giường đôi căn góc thoáng', number: '201' },
  { branch: 'Young House 4', type: 'Giường đôi có hành lang view hồ Tân Xã', number: '301' }
];

const toSlug = (text) => text
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

const buildRoomSlug = (r) => `${toSlug(r.branch)}-${toSlug(r.type)}-${r.number}`;

const urls = [
  ...routes.map((p) => ({ loc: `https://younghousehoalac.com${p}`, changefreq: 'weekly', priority: p === '/' ? 1.0 : 0.8 })),
  ...rooms.map((r) => ({ loc: `https://younghousehoalac.com/room/${buildRoomSlug(r)}`, changefreq: 'weekly', priority: 0.7 }))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

const out = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(out, xml);
console.log('Sitemap generated:', out);


