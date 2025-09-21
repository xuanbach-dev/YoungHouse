# Script tối ưu hóa ảnh bằng ImageMagick
# Tối ưu hóa ảnh branch12-27

Write-Host "Bắt đầu tối ưu hóa ảnh..." -ForegroundColor Green

# Đường dẫn thư mục ảnh
$branch12Path = "public\rooms\branch-12\Type27"

# Hàm tối ưu hóa ảnh
function Optimize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality = 85,
        [int]$MaxWidth = 1920,
        [int]$MaxHeight = 1080
    )
    
    try {
        # Tối ưu hóa ảnh gốc
        magick "$InputPath" -resize "${MaxWidth}x${MaxHeight}>" -quality $Quality -strip "$OutputPath"
        Write-Host "Đã tối ưu: $InputPath -> $OutputPath" -ForegroundColor Green
    }
    catch {
        Write-Host "Lỗi khi tối ưu $InputPath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Hàm tạo WebP
function Create-WebP {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality = 80
    )
    
    try {
        magick "$InputPath" -quality $Quality -strip "$OutputPath"
        Write-Host "Đã tạo WebP: $InputPath -> $OutputPath" -ForegroundColor Cyan
    }
    catch {
        Write-Host "Lỗi khi tạo WebP $InputPath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Hàm tạo thumbnail
function Create-Thumbnail {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Size = 300
    )
    
    try {
        magick "$InputPath" -resize "${Size}x${Size}>" -quality 85 -strip "$OutputPath"
        Write-Host "Đã tạo thumbnail: $InputPath -> $OutputPath" -ForegroundColor Yellow
    }
    catch {
        Write-Host "Lỗi khi tạo thumbnail $InputPath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Tối ưu hóa ảnh branch12-27
Write-Host "`n=== Tối ưu hóa ảnh branch12-27 ===" -ForegroundColor Magenta
$branch12Files = Get-ChildItem -Path $branch12Path -Filter "*.jpg" -File
$branch12Files += Get-ChildItem -Path $branch12Path -Filter "*.JPG" -File

foreach ($file in $branch12Files) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $extension = $file.Extension.ToLower()
    
    # Tối ưu hóa ảnh gốc (ghi đè)
    Optimize-Image -InputPath $file.FullName -OutputPath $file.FullName
    
    # Tạo WebP
    $webpPath = Join-Path $branch12Path "$baseName.webp"
    Create-WebP -InputPath $file.FullName -OutputPath $webpPath
    
    # Tạo thumbnail
    $thumbPath = Join-Path $branch12Path "$baseName.thumb.jpg"
    Create-Thumbnail -InputPath $file.FullName -OutputPath $thumbPath
    
    # Tạo thumbnail WebP
    $thumbWebpPath = Join-Path $branch12Path "$baseName.thumb.webp"
    Create-WebP -InputPath $thumbPath -OutputPath $thumbWebpPath
}

Write-Host "`n=== Hoàn thành tối ưu hóa ảnh ===" -ForegroundColor Green
Write-Host "Đã tối ưu hóa tất cả ảnh branch12-27" -ForegroundColor Green
Write-Host "Các file đã được tạo:" -ForegroundColor White
Write-Host "- Ảnh gốc đã được tối ưu hóa" -ForegroundColor White
Write-Host "- Phiên bản WebP (.webp)" -ForegroundColor White
Write-Host "- Thumbnail (.thumb.jpg)" -ForegroundColor White
Write-Host "- Thumbnail WebP (.thumb.webp)" -ForegroundColor White
