param(
    [int]$Quality = 85,
    [string]$ThumbnailSize = "300x200",
    [switch]$CreateWebP = $true,
    [switch]$CreateAVIF = $false,
    [switch]$Verbose = $false
)

Write-Host "Optimizing Young House 2-20 images..." -ForegroundColor Green

# Check if ImageMagick is installed
try {
    $null = magick -version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "ImageMagick not found"
    }
} catch {
    Write-Host "ImageMagick is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    exit 1
}

# Set directories
$SourceDir = "public\rooms\branch-2\Type20"
$BackupDir = "public\rooms-backup\branch-2\Type20"

# Create backup directory
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# Image files to process
$ImageFiles = @(
    "branch2-20-1.JPG",
    "branch2-20-2.JPG", 
    "branch2-20-3.JPG",
    "branch-20-4.JPG",
    "branch2-20-5.JPG"
)

$ProcessedCount = 0
$TotalSizeBefore = 0
$TotalSizeAfter = 0

foreach ($ImageFile in $ImageFiles) {
    $SourcePath = Join-Path $SourceDir $ImageFile
    
    if (Test-Path $SourcePath) {
        Write-Host "Processing $ImageFile..." -ForegroundColor Cyan
        
        # Get original file size
        $OriginalSize = (Get-Item $SourcePath).Length
        $TotalSizeBefore += $OriginalSize
        
        # Backup original
        $BackupPath = Join-Path $BackupDir $ImageFile
        Copy-Item $SourcePath $BackupPath -Force
        
        # Get base name without extension
        $BaseName = [System.IO.Path]::GetFileNameWithoutExtension($ImageFile)
        
        # Create optimized JPG (convert .JPG to .jpg)
        $OptimizedJpg = Join-Path $SourceDir "$BaseName.jpg"
        $MagickArgs = @(
            "`"$SourcePath`"",
            "-strip",
            "-quality", $Quality,
            "-interlace", "Plane",
            "`"$OptimizedJpg`""
        )
        
        if ($Verbose) {
            Write-Host "  Creating optimized JPG: $BaseName.jpg" -ForegroundColor Gray
        }
        & magick @MagickArgs
        
        # Create thumbnail JPG
        $ThumbJpg = Join-Path $SourceDir "$BaseName.thumb.jpg"
        $ThumbArgs = @(
            "`"$SourcePath`"",
            "-strip",
            "-resize", "${ThumbnailSize}^",
            "-gravity", "center",
            "-extent", $ThumbnailSize,
            "-quality", "80",
            "`"$ThumbJpg`""
        )
        
        if ($Verbose) {
            Write-Host "  Creating thumbnail JPG: $BaseName.thumb.jpg" -ForegroundColor Gray
        }
        & magick @ThumbArgs
        
        # Create WebP version
        if ($CreateWebP) {
            $WebP = Join-Path $SourceDir "$BaseName.webp"
            $WebPArgs = @(
                "`"$SourcePath`"",
                "-strip",
                "-quality", $Quality,
                "`"$WebP`""
            )
            
            if ($Verbose) {
                Write-Host "  Creating WebP: $BaseName.webp" -ForegroundColor Gray
            }
            & magick @WebPArgs
            
            # Create WebP thumbnail
            $ThumbWebP = Join-Path $SourceDir "$BaseName.thumb.webp"
            $ThumbWebPArgs = @(
                "`"$SourcePath`"",
                "-strip",
                "-resize", "${ThumbnailSize}^",
                "-gravity", "center",
                "-extent", $ThumbnailSize,
                "-quality", "80",
                "`"$ThumbWebP`""
            )
            
            if ($Verbose) {
                Write-Host "  Creating WebP thumbnail: $BaseName.thumb.webp" -ForegroundColor Gray
            }
            & magick @ThumbWebPArgs
        }
        
        # Create AVIF version (if supported)
        if ($CreateAVIF) {
            try {
                $AVIF = Join-Path $SourceDir "$BaseName.avif"
                $AVIFArgs = @(
                    "`"$SourcePath`"",
                    "-strip",
                    "-quality", $Quality,
                    "`"$AVIF`""
                )
                
                if ($Verbose) {
                    Write-Host "  Creating AVIF: $BaseName.avif" -ForegroundColor Gray
                }
                & magick @AVIFArgs
            } catch {
                Write-Host "  AVIF creation failed (may not be supported)" -ForegroundColor Yellow
            }
        }
        
        # Calculate total size after optimization
        $OptimizedSize = (Get-Item $OptimizedJpg).Length
        $TotalSizeAfter += $OptimizedSize
        
        $SizeReduction = [math]::Round((($OriginalSize - $OptimizedSize) / $OriginalSize) * 100, 1)
        Write-Host "  ✓ Optimized $ImageFile (${SizeReduction}% size reduction)" -ForegroundColor Green
        
        $ProcessedCount++
    } else {
        Write-Host "  ⚠ File not found: $ImageFile" -ForegroundColor Yellow
    }
}

Write-Host "`nOptimization complete!" -ForegroundColor Green
Write-Host "Processed: $ProcessedCount images" -ForegroundColor Cyan

if ($TotalSizeBefore -gt 0) {
    $TotalReduction = [math]::Round((($TotalSizeBefore - $TotalSizeAfter) / $TotalSizeBefore) * 100, 1)
    $SizeBeforeMB = [math]::Round($TotalSizeBefore / 1MB, 2)
    $SizeAfterMB = [math]::Round($TotalSizeAfter / 1MB, 2)
    
    Write-Host "Total size reduction: ${TotalReduction}% (${SizeBeforeMB}MB → ${SizeAfterMB}MB)" -ForegroundColor Cyan
}

Write-Host "`nCreated files:" -ForegroundColor Yellow
Get-ChildItem $SourceDir | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Gray }

Write-Host "`nBackup saved to: $BackupDir" -ForegroundColor Yellow

Write-Host "`nFile structure after optimization:" -ForegroundColor Yellow
Write-Host "  - Original JPG files (optimized, quality $Quality%)" -ForegroundColor Gray
Write-Host "  - Thumbnail JPG files ($ThumbnailSize, quality 80%)" -ForegroundColor Gray
if ($CreateWebP) {
    Write-Host "  - WebP files (modern format, quality $Quality%)" -ForegroundColor Gray
    Write-Host "  - WebP thumbnail files ($ThumbnailSize, quality 80%)" -ForegroundColor Gray
}
if ($CreateAVIF) {
    Write-Host "  - AVIF files (next-gen format, quality $Quality%)" -ForegroundColor Gray
}
