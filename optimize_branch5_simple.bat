@echo off
echo Optimizing Young House 5 images...

REM Check if ImageMagick is installed
magick -version >nul 2>&1
if errorlevel 1 (
    echo ImageMagick is not installed. Please install it first.
    echo Download from: https://imagemagick.org/script/download.php#windows
    pause
    exit /b 1
)

REM Set directories
set SOURCE_DIR=public\rooms\branch-5\Type15
set BACKUP_DIR=public\rooms-backup\branch-5\Type15

REM Create backup directory
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo Processing branch5-1.jpg...
if exist "%SOURCE_DIR%\branch5-1.jpg" (
    REM Backup original
    copy "%SOURCE_DIR%\branch5-1.jpg" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch5-1.jpg" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch5-1.jpg"
    magick "%SOURCE_DIR%\branch5-1.jpg" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch5-1.thumb.jpg"
    magick "%SOURCE_DIR%\branch5-1.jpg" -strip -quality 85 "%SOURCE_DIR%\branch5-1.webp"
    magick "%SOURCE_DIR%\branch5-1.jpg" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch5-1.thumb.webp"
    echo ✓ Optimized branch5-1.jpg
)

echo Processing branch5-2.jpg...
if exist "%SOURCE_DIR%\branch5-2.jpg" (
    REM Backup original
    copy "%SOURCE_DIR%\branch5-2.jpg" "%BACKUP_DIR%\" >nul
    
    REM Create optimized versions
    magick "%SOURCE_DIR%\branch5-2.jpg" -strip -quality 85 -interlace Plane "%SOURCE_DIR%\branch5-2.jpg"
    magick "%SOURCE_DIR%\branch5-2.jpg" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch5-2.thumb.jpg"
    magick "%SOURCE_DIR%\branch5-2.jpg" -strip -quality 85 "%SOURCE_DIR%\branch5-2.webp"
    magick "%SOURCE_DIR%\branch5-2.jpg" -strip -resize 300x200^ -gravity center -extent 300x200 -quality 80 "%SOURCE_DIR%\branch5-2.thumb.webp"
    echo ✓ Optimized branch5-2.jpg
)

echo.
echo Optimization complete!
echo Created files:
dir /b "%SOURCE_DIR%\*" 2>nul
echo.
echo Backup saved to: %BACKUP_DIR%
pause
