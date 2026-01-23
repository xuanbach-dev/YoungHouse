import React, { useState, useCallback } from 'react';
import { 
  getCloudinaryUrl, 
  getCloudinaryThumbnail, 
  getCloudinaryPlaceholder,
  getCloudinarySrcSet,
  isCloudinaryConfigured 
} from '../utils/cloudinary';

interface CloudinaryImageProps {
  /** Đường dẫn ảnh local (ví dụ: '/rooms/branch-1/Type1/branch1-1.jpg') */
  src: string;
  /** Alt text cho accessibility */
  alt: string;
  /** Chiều rộng mặc định */
  width?: number;
  /** Chiều cao */
  height?: number;
  /** CSS className */
  className?: string;
  /** Loading strategy: 'lazy' | 'eager' */
  loading?: 'lazy' | 'eager';
  /** Sizes attribute cho responsive */
  sizes?: string;
  /** Custom widths cho srcSet */
  srcSetWidths?: number[];
  /** Hiển thị blur placeholder khi loading */
  showPlaceholder?: boolean;
  /** Callback khi click vào ảnh */
  onClick?: () => void;
  /** Callback khi ảnh load lỗi */
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Thumbnail mode - chỉ load ảnh nhỏ */
  thumbnail?: boolean;
  /** Thumbnail size nếu thumbnail=true */
  thumbnailSize?: number;
}

/**
 * CloudinaryImage Component
 * 
 * Tự động tối ưu ảnh với Cloudinary nếu đã cấu hình,
 * fallback về ảnh local nếu chưa.
 * 
 * @example
 * // Basic usage
 * <CloudinaryImage 
 *   src="/rooms/branch-1/Type1/branch1-1.jpg"
 *   alt="Phòng Young House 1"
 * />
 * 
 * @example
 * // With responsive sizes
 * <CloudinaryImage 
 *   src="/rooms/branch-1/Type1/branch1-1.jpg"
 *   alt="Phòng"
 *   width={800}
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
 * />
 * 
 * @example
 * // Thumbnail mode
 * <CloudinaryImage 
 *   src="/rooms/branch-1/Type1/branch1-1.jpg"
 *   alt="Thumbnail"
 *   thumbnail
 *   thumbnailSize={150}
 * />
 */
const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width = 800,
  height,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  srcSetWidths,
  showPlaceholder = true,
  onClick,
  onError,
  style,
  thumbnail = false,
  thumbnailSize = 150,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isConfigured = isCloudinaryConfigured();

  // Tính toán URLs
  const imageSrc = thumbnail
    ? (isConfigured ? getCloudinaryThumbnail(src, thumbnailSize) : src)
    : (isConfigured ? getCloudinaryUrl(src, { width }) : src);

  const placeholderSrc = isConfigured && showPlaceholder 
    ? getCloudinaryPlaceholder(src) 
    : undefined;

  const srcSet = !thumbnail && isConfigured 
    ? getCloudinarySrcSet(src, srcSetWidths) 
    : undefined;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    
    // Fallback to local image if Cloudinary fails
    if (isConfigured && e.currentTarget.src !== src) {
      e.currentTarget.src = src;
    }
    
    onError?.(e);
  }, [src, isConfigured, onError]);

  // Fallback image nếu load lỗi hoàn toàn
  if (hasError && !isConfigured) {
    return (
      <div 
        className={`cloudinary-image-error ${className}`}
        style={{ 
          width: width || thumbnailSize, 
          height: height || 'auto',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style 
        }}
      >
        <span style={{ color: '#999' }}>Không thể tải ảnh</span>
      </div>
    );
  }

  return (
    <div 
      className={`cloudinary-image-wrapper ${className}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        ...style 
      }}
    >
      {/* Blur placeholder */}
      {showPlaceholder && placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Main image */}
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded || !showPlaceholder ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
};

export default CloudinaryImage;
