# Young House 5 Image Optimization Guide

## 📋 Prerequisites

### Install ImageMagick
**Windows:**
```bash
# Option 1: Using Chocolatey
choco install imagemagick

# Option 2: Download from official site
# https://imagemagick.org/script/download.php#windows
```

**macOS:**
```bash
brew install imagemagick
```

**Ubuntu/Debian:**
```bash
sudo apt-get install imagemagick
```

## 🚀 Quick Start

### Method 1: Simple Batch Script (Windows)
```bash
# Double-click or run in Command Prompt
optimize_yh5_images.bat
```

### Method 2: PowerShell Script (Windows)
```powershell
# Run in PowerShell
.\optimize_yh5_images.ps1
```

### Method 3: Advanced PowerShell (Windows)
```powershell
# Basic optimization
.\advanced_optimize_yh5.ps1

# High quality optimization
.\advanced_optimize_yh5.ps1 -Quality 90

# Create AVIF format (requires newer ImageMagick)
.\advanced_optimize_yh5.ps1 -CreateAVIF

# Custom thumbnail size
.\advanced_optimize_yh5.ps1 -ThumbnailSize "400x300"
```

### Method 4: Bash Script (Linux/macOS)
```bash
chmod +x optimize_yh5_images.sh
./optimize_yh5_images.sh
```

## 📁 File Structure After Optimization

```
public/rooms/branch-5/Type15/
├── branch5-1.jpg          # Optimized original
├── branch5-1.thumb.jpg    # Thumbnail (300x200)
├── branch5-1.webp         # WebP version
├── branch5-1.thumb.webp   # WebP thumbnail
├── branch5-2.jpg          # Optimized original
├── branch5-2.thumb.jpg    # Thumbnail (300x200)
├── branch5-2.webp         # WebP version
└── branch5-2.thumb.webp   # WebP thumbnail

public/rooms-backup/branch-5/Type15/
├── branch5-1.jpg          # Original backup
└── branch5-2.jpg          # Original backup
```

## ⚙️ Optimization Settings

### Default Settings
- **Quality**: 85% (good balance of quality/size)
- **Thumbnail Size**: 300x200px
- **Progressive JPEG**: Enabled
- **Metadata Stripping**: Enabled
- **WebP Creation**: Enabled

### Quality Levels
- **60-70%**: High compression, noticeable quality loss
- **80-85%**: Good balance (recommended)
- **90-95%**: High quality, larger files
- **100%**: Lossless, largest files

## 🎯 Benefits

### File Size Reduction
- **JPEG Optimization**: 20-40% size reduction
- **WebP Format**: 25-50% additional reduction
- **Thumbnail Creation**: 80-90% size reduction

### Performance Improvements
- **Faster Loading**: Smaller file sizes
- **Progressive JPEG**: Better perceived loading
- **WebP Support**: Modern browsers load faster
- **Responsive Images**: Multiple sizes available

## 🔧 Manual ImageMagick Commands

### Optimize Single Image
```bash
magick input.jpg -strip -quality 85 -interlace Plane output.jpg
```

### Create Thumbnail
```bash
magick input.jpg -resize 300x200^ -gravity center -extent 300x200 thumb.jpg
```

### Convert to WebP
```bash
magick input.jpg -quality 85 output.webp
```

### Batch Process
```bash
for %f in (*.jpg) do magick "%f" -strip -quality 85 "optimized_%f"
```

## 🐛 Troubleshooting

### ImageMagick Not Found
```bash
# Check installation
magick -version

# Add to PATH if needed
# Windows: Add ImageMagick installation directory to system PATH
```

### Permission Errors
```bash
# Run as Administrator (Windows)
# Or check file permissions
```

### Large File Sizes
```bash
# Reduce quality
.\advanced_optimize_yh5.ps1 -Quality 75

# Skip WebP creation
.\advanced_optimize_yh5.ps1 -CreateWebP:$false
```

## 📊 Expected Results

### Before Optimization
- Original images: 2-5 MB each
- No thumbnails
- No WebP versions

### After Optimization
- Optimized JPG: 200-800 KB each
- Thumbnails: 20-50 KB each
- WebP: 150-600 KB each
- **Total savings: 60-80%**

## 🔄 Updating Code

After optimization, update your code to use the new formats:

```typescript
// Use WebP with JPG fallback
<picture>
  <source srcSet="/rooms/branch-5/Type15/branch5-1.webp" type="image/webp" />
  <img src="/rooms/branch-5/Type15/branch5-1.jpg" alt="Young House 5" />
</picture>

// Use thumbnails for lists
<img src="/rooms/branch-5/Type15/branch5-1.thumb.jpg" alt="Young House 5" />
```

## 📝 Notes

- Original files are backed up to `public/rooms-backup/`
- Scripts are safe to run multiple times
- WebP provides better compression but requires modern browsers
- Thumbnails maintain aspect ratio with center cropping
- Progressive JPEG improves perceived loading speed
