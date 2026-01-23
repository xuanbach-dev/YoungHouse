/**
 * Script upload ảnh từ public/rooms lên Cloudinary
 * 
 * Cách sử dụng:
 * 1. Cài đặt: npm install cloudinary dotenv
 * 2. Tạo file .env với CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * 3. Chạy: node scripts/upload-to-cloudinary.mjs
 */

import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables từ thư mục gốc project
const envPath = join(__dirname, '..', '.env');
console.log('📂 Loading .env from:', envPath);
const result = config({ path: envPath });
if (result.error) {
  console.error('❌ Error loading .env:', result.error.message);
}

// Configure Cloudinary (hỗ trợ cả 2 format tên biến)
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
console.log('🔍 Debug - CLOUD_NAME:', CLOUD_NAME);
console.log('🔍 Debug - API_KEY exists:', !!process.env.CLOUDINARY_API_KEY);
console.log('🔍 Debug - API_SECRET exists:', !!process.env.CLOUDINARY_API_SECRET);
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG'];

// Get all image files recursively
function getAllImages(dir, fileList = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (IMAGE_EXTENSIONS.includes(extname(file))) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Upload a single image
async function uploadImage(localPath, publicFolder) {
  const relativePath = relative(publicFolder, localPath);
  // Remove extension for public_id
  const publicId = 'younghouse/' + relativePath.replace(/\\/g, '/').replace(/\.[^.]+$/, '');
  
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      // Auto-optimize
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    
    console.log(`✅ Uploaded: ${relativePath}`);
    console.log(`   URL: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed: ${relativePath}`, error.message);
    return null;
  }
}

// Main function
async function main() {
  // Check environment variables
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('❌ Missing Cloudinary credentials in .env file');
    console.log('Please add the following to your .env file:');
    console.log('REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('CLOUDINARY_API_KEY=your_api_key');
    console.log('CLOUDINARY_API_SECRET=your_api_secret');
    process.exit(1);
  }
  
  console.log(`☁️  Cloud Name: ${CLOUD_NAME}`);

  const publicRoomsFolder = join(__dirname, '..', 'public', 'rooms');
  
  console.log('🔍 Scanning for images in:', publicRoomsFolder);
  
  const images = getAllImages(publicRoomsFolder);
  
  console.log(`📦 Found ${images.length} images to upload\n`);
  
  // Upload in batches of 10 to avoid rate limiting
  const batchSize = 10;
  let uploaded = 0;
  let failed = 0;
  
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    
    console.log(`\n📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(images.length / batchSize)}...\n`);
    
    const results = await Promise.all(
      batch.map(img => uploadImage(img, join(__dirname, '..', 'public')))
    );
    
    uploaded += results.filter(r => r !== null).length;
    failed += results.filter(r => r === null).length;
    
    // Small delay between batches
    if (i + batchSize < images.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Upload completed!`);
  console.log(`   Successful: ${uploaded}`);
  console.log(`   Failed: ${failed}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
