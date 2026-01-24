import React, { useState, useEffect, useRef, memo } from 'react';
import './OptimizedRoomImage.css';

interface OptimizedRoomImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  fallbackText?: string;
  height?: string | number;
}

const OptimizedRoomImage: React.FC<OptimizedRoomImageProps> = memo(({
  src,
  webpSrc,
  alt,
  className = '',
  onClick,
  fallbackText = 'Hình ảnh phòng',
  height = '200px'
}) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoadState('loaded');
  };

  const handleError = () => {
    setLoadState('error');
  };

  return (
    <div
      ref={containerRef}
      className={`optimized-room-image ${className} ${loadState}`}
      onClick={onClick}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* Skeleton Loader */}
      {loadState === 'loading' && (
        <div className="room-image-skeleton">
          <div className="skeleton-shimmer"></div>
          <div className="skeleton-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && loadState !== 'error' && (
        webpSrc ? (
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={src}
              alt={alt}
              className={`room-img ${loadState === 'loaded' ? 'visible' : ''}`}
              onLoad={handleLoad}
              onError={handleError}
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <img
            src={src}
            alt={alt}
            className={`room-img ${loadState === 'loaded' ? 'visible' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />
        )
      )}

      {/* Error State */}
      {loadState === 'error' && (
        <div className="room-image-error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>{fallbackText}</span>
        </div>
      )}
    </div>
  );
});

OptimizedRoomImage.displayName = 'OptimizedRoomImage';

export default OptimizedRoomImage;
