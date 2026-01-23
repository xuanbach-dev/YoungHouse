/**
 * Cloudinary Image Utility
 * 
 * Sử dụng Cloudinary để tối ưu hình ảnh với các tính năng:
 * - Auto format (WebP/AVIF tùy browser)
 * - Auto quality optimization
 * - Responsive images với nhiều kích thước
 * - Lazy loading support
 */

// Cloudinary cloud name từ environment variable
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';

// Base URL cho Cloudinary
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Options cho việc tạo Cloudinary URL
 */
interface CloudinaryOptions {
  /** Chiều rộng (pixels) */
  width?: number;
  /** Chiều cao (pixels) */
  height?: number;
  /** Chất lượng: 'auto', 'auto:low', 'auto:eco', 'auto:good', 'auto:best' hoặc số 1-100 */
  quality?: string | number;
  /** Format: 'auto', 'webp', 'avif', 'jpg', 'png' */
  format?: string;
  /** Crop mode: 'fill', 'fit', 'scale', 'crop', 'thumb' */
  crop?: string;
  /** Gravity cho crop: 'auto', 'face', 'center', 'north', 'south', 'east', 'west' */
  gravity?: string;
  /** Blur effect (1-2000) */
  blur?: number;
  /** DPR (Device Pixel Ratio): 'auto' hoặc số */
  dpr?: string | number;
}

/**
 * Chuyển đổi đường dẫn local sang Cloudinary URL
 * 
 * @param localPath - Đường dẫn ảnh local (ví dụ: '/rooms/branch-1/Type1/branch1-1.jpg')
 * @param options - Tùy chọn tối ưu hóa
 * @returns URL Cloudinary đã được tối ưu
 * 
 * @example
 * // Ảnh thông thường với auto optimization
 * getCloudinaryUrl('/rooms/branch-1/Type1/branch1-1.jpg')
 * // => https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto/younghouse/rooms/branch-1/Type1/branch1-1
 * 
 * @example
 * // Ảnh với width cố định
 * getCloudinaryUrl('/rooms/branch-1/Type1/branch1-1.jpg', { width: 400, quality: 'auto:good' })
 * // => https://res.cloudinary.com/xxx/image/upload/w_400,f_auto,q_auto:good/younghouse/rooms/...
 */
export function getCloudinaryUrl(localPath: string, options: CloudinaryOptions = {}): string {
  // Nếu chưa cấu hình Cloudinary, trả về đường dẫn local
  if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
    return localPath;
  }

  // Loại bỏ extension và / đầu tiên
  const cleanPath = localPath
    .replace(/^\//, '')  // Bỏ / đầu tiên
    .replace(/\.(jpg|jpeg|png|webp|gif|JPG|JPEG|PNG)$/i, ''); // Bỏ extension

  // Build transformations
  const transformations: string[] = [];

  // Width
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }

  // Height
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }

  // Crop mode
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  // Gravity
  if (options.gravity) {
    transformations.push(`g_${options.gravity}`);
  }

  // Format - mặc định auto
  transformations.push(`f_${options.format || 'auto'}`);

  // Quality - mặc định auto
  transformations.push(`q_${options.quality || 'auto'}`);

  // DPR
  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`);
  }

  // Blur
  if (options.blur) {
    transformations.push(`e_blur:${options.blur}`);
  }

  const transformString = transformations.join(',');

  return `${CLOUDINARY_BASE_URL}/${transformString}/younghouse/${cleanPath}`;
}

/**
 * Tạo URL cho thumbnail
 * 
 * @param localPath - Đường dẫn ảnh local
 * @param size - Kích thước thumbnail (mặc định 150)
 */
export function getCloudinaryThumbnail(localPath: string, size: number = 150): string {
  return getCloudinaryUrl(localPath, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:low',
  });
}

/**
 * Tạo URL cho ảnh blur placeholder (LQIP - Low Quality Image Placeholder)
 * 
 * @param localPath - Đường dẫn ảnh local
 */
export function getCloudinaryPlaceholder(localPath: string): string {
  return getCloudinaryUrl(localPath, {
    width: 30,
    quality: 'auto:low',
    blur: 1000,
  });
}

/**
 * Tạo srcSet cho responsive images
 * 
 * @param localPath - Đường dẫn ảnh local
 * @param widths - Mảng các width (mặc định [320, 640, 960, 1280, 1920])
 * @returns srcSet string cho thẻ img
 * 
 * @example
 * <img 
 *   src={getCloudinaryUrl('/rooms/...', { width: 800 })}
 *   srcSet={getCloudinarySrcSet('/rooms/...')}
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
 * />
 */
export function getCloudinarySrcSet(
  localPath: string, 
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map(w => `${getCloudinaryUrl(localPath, { width: w })} ${w}w`)
    .join(', ');
}

/**
 * Hook-friendly function để lấy props cho thẻ img
 * 
 * @param localPath - Đường dẫn ảnh local
 * @param options - Tùy chọn
 * @returns Object chứa src, srcSet, sizes
 * 
 * @example
 * const imgProps = getCloudinaryImageProps('/rooms/branch-1/Type1/branch1-1.jpg', {
 *   defaultWidth: 800,
 *   sizes: '(max-width: 640px) 100vw, 800px'
 * });
 * 
 * <img {...imgProps} alt="Room" loading="lazy" />
 */
export function getCloudinaryImageProps(
  localPath: string,
  options: {
    defaultWidth?: number;
    sizes?: string;
    widths?: number[];
  } = {}
): { src: string; srcSet: string; sizes: string } {
  const { defaultWidth = 800, sizes = '100vw', widths } = options;

  return {
    src: getCloudinaryUrl(localPath, { width: defaultWidth }),
    srcSet: getCloudinarySrcSet(localPath, widths),
    sizes,
  };
}

/**
 * Kiểm tra xem Cloudinary đã được cấu hình chưa
 */
export function isCloudinaryConfigured(): boolean {
  return !!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
}

// Export default object cho convenience
const cloudinaryUtils = {
  getUrl: getCloudinaryUrl,
  getThumbnail: getCloudinaryThumbnail,
  getPlaceholder: getCloudinaryPlaceholder,
  getSrcSet: getCloudinarySrcSet,
  getImageProps: getCloudinaryImageProps,
  isConfigured: isCloudinaryConfigured,
};

export default cloudinaryUtils;
