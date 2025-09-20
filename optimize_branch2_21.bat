@echo off
echo Optimizing Young House 2-21 images...

REM Check if ImageMagick is installed
magick -version >nul 2>&1
if errorlevel 1 (
    echo ImageMagick is not installed. Please install it first.
    echo Download from: https://imagemagick.org/script/download.php#windows
    pause
    exit /b 1
)

REM Set directories
set SOURCE_DIR=public\rooms\branch-2\Type21
set BACKUP_DIR=public\rooms-backup\branch-2\Type21

REM Create backup directory
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo Processing branch2-21-1.JPG...
if exist "%SOURCE_DIR%\branch2-21-1.JPG" (
    REM Backup original
    copy "%SOURCE_DIR%\branch2-21-1.JPG" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch2-21-1.JPG" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch2-21-1.jpg"
    magick "%SOURCE_DIR%\branch2-21-1.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-1.thumb.jpg"
    magick "%SOURCE_DIR%\branch2-21-1.JPG" -strip -quality 85 "%SOURCE_DIR%\branch2-21-1.webp"
    magick "%SOURCE_DIR%\branch2-21-1.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-1.thumb.webp"
    echo ✓ Optimized branch2-21-1.JPG
)

echo Processing branch2-21-2.JPG...
if exist "%SOURCE_DIR%\branch2-21-2.JPG" (
    REM Backup original
    copy "%SOURCE_DIR%\branch2-21-2.JPG" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch2-21-2.JPG" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch2-21-2.jpg"
    magick "%SOURCE_DIR%\branch2-21-2.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-2.thumb.jpg"
    magick "%SOURCE_DIR%\branch2-21-2.JPG" -strip -quality 85 "%SOURCE_DIR%\branch2-21-2.webp"
    magick "%SOURCE_DIR%\branch2-21-2.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-2.thumb.webp"
    echo ✓ Optimized branch2-21-2.JPG
)

echo Processing branch2-21-3.JPG...
if exist "%SOURCE_DIR%\branch2-21-3.JPG" (
    REM Backup original
    copy "%SOURCE_DIR%\branch2-21-3.JPG" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch2-21-3.JPG" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch2-21-3.jpg"
    magick "%SOURCE_DIR%\branch2-21-3.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-3.thumb.jpg"
    magick "%SOURCE_DIR%\branch2-21-3.JPG" -strip -quality 85 "%SOURCE_DIR%\branch2-21-3.webp"
    magick "%SOURCE_DIR%\branch2-21-3.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-3.thumb.webp"
    echo ✓ Optimized branch2-21-3.JPG
)

echo Processing branch2-21-4.JPG...
if exist "%SOURCE_DIR%\branch2-21-4.JPG" (
    REM Backup original
    copy "%SOURCE_DIR%\branch2-21-4.JPG" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch2-21-4.JPG" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch2-21-4.jpg"
    magick "%SOURCE_DIR%\branch2-21-4.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-4.thumb.jpg"
    magick "%SOURCE_DIR%\branch2-21-4.JPG" -strip -quality 85 "%SOURCE_DIR%\branch2-21-4.webp"
    magick "%SOURCE_DIR%\branch2-21-4.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-4.thumb.webp"
    echo ✓ Optimized branch2-21-4.JPG
)

echo Processing branch2-21-5.JPG...
if exist "%SOURCE_DIR%\branch2-21-5.JPG" (
    REM Backup original
    copy "%SOURCE_DIR%\branch2-21-5.JPG" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch2-21-5.JPG" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch2-21-5.jpg"
    magick "%SOURCE_DIR%\branch2-21-5.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-5.thumb.jpg"
    magick "%SOURCE_DIR%\branch2-21-5.JPG" -strip -quality 85 "%SOURCE_DIR%\branch2-21-5.webp"
    magick "%SOURCE_DIR%\branch2-21-5.JPG" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch2-21-5.thumb.webp"
    echo ✓ Optimized branch2-21-5.JPG
)

echo.
echo Optimization complete!
echo Created files:
dir /b "%SOURCE_DIR%\*" 2>nul
echo.
echo Backup saved to: %BACKUP_DIR%
echo.
echo File structure after optimization:
echo - Original JPG files (optimized)
echo - Thumbnail JPG files (300x200)
echo - WebP files (modern format)
echo - WebP thumbnail files (300x200)
echo.
pause
