import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Phone as PhoneIcon,
  Star,
  Heart,
  Calendar, // Add Calendar icon
  X,
  ZoomIn
} from 'lucide-react';
// import { roomsAPI } from '../services/api';
import { Room } from '../types';
import ViewingAppointmentForm from '../components/ViewingAppointmentForm'; // Re-import the form
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import SurroundingAreas from '../components/SurroundingAreas';
import RoomReviews from '../components/RoomReviews';
import './RoomDetail.css';
import Meta from '../components/Meta';
import { toSlug, buildRoomSlug } from '../utils/slug';
import { getCloudinaryUrl, getCloudinaryThumbnail, isCloudinaryConfigured } from '../utils/cloudinary';
import { fetchRooms as fetchRoomsFromService, getRoomBySlug } from '../services/roomService';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showViewingAppointmentForm, setShowViewingAppointmentForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageAttempts, setImageAttempts] = useState<Record<number, number>>({});

  // Optional: YouTube video per branch. Fill in the exact links later.
  const branchVideoUrls: Record<number, string> = {
    1: 'https://www.youtube.com/watch?v=E1KWKr3gxUc',
    2: 'https://www.youtube.com/watch?v=D2Go9l19KR8',
    4: 'https://www.youtube.com/watch?v=jXL-mNsignU',
    5: 'https://www.youtube.com/watch?v=ZkQUzKE3GKg',
    7: 'https://www.youtube.com/watch?v=4m3r_T2hwps',
    8: 'https://www.youtube.com/watch?v=eg2vSMeFfmo',
    9: 'https://www.youtube.com/watch?v=C0_2w-yNgGo',
    10: 'https://www.youtube.com/watch?v=dB8UXfhhC_A',
    11: 'https://www.youtube.com/watch?v=WbDRp5rI_2s',
    12: 'https://www.youtube.com/watch?v=DWUOLNPVzHw',
    14: 'https://www.youtube.com/watch?v=grtZYFLfBVw'
  };

  const toYouTubeEmbed = (url: string): string => {
    if (!url) return '';
    try {
      // Support youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>
      const u = new URL(url);
      let id = '';
      if (u.hostname === 'youtu.be') {
        id = u.pathname.replace('/', '');
      } else if (u.searchParams.get('v')) {
        id = u.searchParams.get('v') || '';
      } else {
        // /embed/<id> or /shorts/<id>
        const parts = u.pathname.split('/').filter(Boolean);
        id = parts.pop() || '';
      }
      return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : '';
    } catch {
      return '';
    }
  };

  // Rooms data is now fetched from roomService (Supabase or local fallback)
  // allRooms state is populated via useEffect below

  // Use public images under /public/rooms/branch-<branchId>/TypeX/<filename>
  const getRoomImages = (room: Room): string[] => {
    const branchId = room.BranchID || room.branchId || 1;
    const images: string[] = [];

    // Branch-specific patterns that match your public folder
    if (branchId === 1) {
      const roomTypeId = room.RoomTypeID || (room as any).roomTypeId;

      // Handle Type25 for roomID 17
      if (roomTypeId === 25) {
        for (let i = 1; i <= 5; i++) {
          images.push(`/rooms/branch-1/Type25/branch1-25-${i}.jpg`);
        }
        return images;
      }

      // Default Type1 for other rooms in branch 1
      // branch-1/Type1/branch1-<i>.jpg (1..9), note last may be .JPG but onError will handle
      for (let i = 1; i <= 9; i++) {
        images.push(`/rooms/branch-1/Type1/branch1-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 2) {
      // Type depends on RoomTypeID: 5->Type5 (branch2-1-i.JPG), 3->Type3 (branch2-2-i.JPG), 4->Type4 (branch2-3-i.JPG), 20->Type20 (branch2-20-i.JPG)
      const roomTypeId = room.RoomTypeID || (room as any).roomTypeId;
      let typeFolder = 'Type5';
      let prefix = 'branch2-1-';
      let count = 7;
      if (roomTypeId === 3) { typeFolder = 'Type3'; prefix = 'branch2-2-'; count = 4; }
      if (roomTypeId === 4) { typeFolder = 'Type4'; prefix = 'branch2-3-'; count = 2; }
      if (roomTypeId === 20) {
        typeFolder = 'Type20';
        // Handle both naming patterns: branch2-20-X and branch-20-X
        images.push('/rooms/branch-2/Type20/branch2-20-1.JPG');
        images.push('/rooms/branch-2/Type20/branch2-20-2.JPG');
        images.push('/rooms/branch-2/Type20/branch2-20-3.JPG');
        images.push('/rooms/branch-2/Type20/branch-20-4.JPG'); // Special case for image 4
        images.push('/rooms/branch-2/Type20/branch2-20-5.JPG');
        return images;
      }
      if (roomTypeId === 21) {
        typeFolder = 'Type21';
        // Type21: branch2-21-X (5 images)
        for (let i = 1; i <= 5; i++) {
          images.push(`/rooms/branch-2/Type21/branch2-21-${i}.JPG`);
        }
        return images;
      }
      if (roomTypeId === 22) {
        typeFolder = 'Type22';
        // Type22: branch2-22-X (3 images)
        for (let i = 1; i <= 3; i++) {
          images.push(`/rooms/branch-2/Type22/branch2-22-${i}.JPG`);
        }
        return images;
      }
      for (let i = 1; i <= count; i++) {
        images.push(`/rooms/branch-2/${typeFolder}/${prefix}${i}.JPG`);
      }
      return images;
    }

    if (branchId === 4) {
      // Default Type12 for rooms in branch 4
      for (let i = 1; i <= 6; i++) {
        images.push(`/rooms/branch-4/Type12/branch4-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 7) {
      for (let i = 1; i <= 6; i++) {
        images.push(`/rooms/branch-7/Type16/branch7-${i}.png`);
      }
      return images;
    }

    if (branchId === 8) {
      for (let i = 1; i <= 6; i++) {
        images.push(`/rooms/branch-8/Type17/branch8-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 9) {
      // 9 images, last two are .JPG; start with .jpg
      for (let i = 1; i <= 9; i++) {
        const ext = i >= 8 ? 'JPG' : 'jpg';
        images.push(`/rooms/branch-9/Type10/branch9-${i}.${ext}`);
      }
      return images;
    }

    if (branchId === 10) {
      // Available images: branch10-3.jpg to branch10-6.jpg
      for (let i = 3; i <= 6; i++) {
        images.push(`/rooms/branch-10/Type11/branch10-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 5) {
      const roomTypeId = room.RoomTypeID || (room as any).roomTypeId;

      // Handle Type26 for roomID 18
      if (roomTypeId === 26) {
        for (let i = 1; i <= 6; i++) {
          images.push(`/rooms/branch-5/Type26/branch5-26-${i}.jpg`);
        }
        return images;
      }

      // Handle Type15 for roomID 11
      if (roomTypeId === 15) {
        for (let i = 1; i <= 2; i++) {
          images.push(`/rooms/branch-5/Type15/branch5-${i}.jpg`);
        }
        return images;
      }

      // Default fallback for other rooms in branch 5
      const available = [1, 2];
      for (const i of available) {
        images.push(`/rooms/branch-5/Type15/branch5-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 6) {
      // Branch 6 uses Type30; filenames available in public folder
      // Note: first image file name has a typo in source assets (brranch6-30-1.jpg)
      images.push('/rooms/branch-6/Type30/brranch6-30-1.jpg');
      images.push('/rooms/branch-6/Type30/branch6-30-2.jpg');
      images.push('/rooms/branch-6/Type30/branch6-30-3.jpg');
      return images;
    }

    if (branchId === 11) {
      for (let i = 1; i <= 7; i++) {
        images.push(`/rooms/branch-11/Type8/branch11-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 12) {
      const roomTypeId = room.RoomTypeID || (room as any).roomTypeId;

      // Handle Type27 for roomID 19
      if (roomTypeId === 27) {
        for (let i = 1; i <= 4; i++) {
          images.push(`/rooms/branch-12/Type27/branch12-27-${i}.jpg`);
        }
        return images;
      }

      // Default Type7 for other rooms in branch 12
      for (let i = 1; i <= 9; i++) {
        images.push(`/rooms/branch-12/Type7/branch12-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 14) {
      for (let i = 1; i <= 8; i++) {
        images.push(`/rooms/branch-14/Type13/branch14-${i}.png`);
      }
      return images;
    }

    // Fallback to a known valid image (avoid placeholder)
    images.push('/rooms/branch-1/Type1/branch1-1.jpg');
    return images;
  };

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setShowImageModal(false);
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showImageModal, images.length]);

  // Fetch all rooms for similar rooms section
  useEffect(() => {
    const loadAllRooms = async () => {
      try {
        const roomsData = await fetchRoomsFromService();
        setAllRooms(roomsData);
      } catch (err) {
        console.error('Error fetching all rooms:', err);
      }
    };
    loadAllRooms();
  }, []);

  // Load room by slug from roomService
  useEffect(() => {
    const loadRoom = async () => {
      console.log('RoomDetail useEffect triggered:', { id, slug });
      if (!id && !slug) return;

      setIsLoading(true);
      setError(null);

      try {
        let found: Room | null = null;
        
        if (slug) {
          // Use roomService to find room by slug
          found = await getRoomBySlug(slug);
        }
        
        if (found) {
          console.log('Setting room:', found);
          setRoom(found);
          const imgs = getRoomImages(found);
          setImages(imgs);
          setImageAttempts({});
        } else {
          console.log('Room not found for slug:', slug);
          setError('Không tìm thấy thông tin phòng');
        }
      } catch (err) {
        console.error('Error loading room:', err);
        setError('Có lỗi xảy ra khi tải thông tin phòng');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [id, slug, navigate]);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Touch swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const formatPrice = (price: number) => {
    return `Từ ${new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)}`;
  };

  // Get service fee based on branch (fallback defaults)
  const getServiceFee = (room: Room): number => {
    if ((room as any).ServiceFee || (room as any).serviceFee) {
      return (room as any).ServiceFee || (room as any).serviceFee || 0;
    }
    const b = room.BranchID || room.branchId;
    if (b === 10 || b === 14 || b === 6) return 180000;
    return 230000;
  };

  const getElectricityFee = (room: Room): number => {
    if ((room as any).ElectricityFee || (room as any).electricityFee) {
      return (room as any).ElectricityFee || (room as any).electricityFee || 0;
    }
    return 3200;
  };

  // Try alternate srcs when image fails: swap extension and folder name
  const handleImageError = (index: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const attempt = (imageAttempts[index] ?? 0) + 1;
    const currentSrc = (e.currentTarget as HTMLImageElement).src;

    // Generate next candidate based on attempt order
    const candidates: string[] = [];
    const swapFolder = (src: string) => src.includes('/rooms/') ? src.replace('/rooms/', '/room/') : src.replace('/room/', '/rooms/');
    const swapExt = (src: string, to: string) => src.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.' + to;

    // 1: try swap ext to JPG
    candidates.push(swapExt(currentSrc, 'JPG'));
    // 2: try swap ext to jpg
    candidates.push(swapExt(currentSrc, 'jpg'));
    // 3: try swap ext to PNG
    candidates.push(swapExt(currentSrc, 'PNG'));
    // 4: try swap ext to png
    candidates.push(swapExt(currentSrc, 'png'));
    // 5: try swap folder rooms<->room (keep current ext)
    candidates.push(swapFolder(currentSrc));

    const nextSrc = candidates[attempt - 1];
    if (nextSrc) {
      setImageAttempts(prev => ({ ...prev, [index]: attempt }));
      setImages(prev => prev.map((s, i) => (i === index ? nextSrc : s)));
    } else {
      // Give up: set to a safe known image per branch (avoid placeholder)
      const branchId = room?.BranchID || (room as any)?.branchId;
      const safeSrc = branchId === 10
        ? '/rooms/branch-10/Type11/branch10-1.jpg'
        : branchId === 1
          ? '/rooms/branch-1/Type1/branch1-1.jpg'
          : branchId === 6
            ? '/rooms/branch-6/Type30/branch6-30-2.jpg'
            : branchId === 4
              ? '/rooms/branch-4/Type12/branch4-1.jpg'
              : branchId === 5
                ? '/rooms/branch-5/Type15/branch5-1.jpg'
                : branchId === 7
                  ? '/rooms/branch-7/Type16/branch7-1.png'
                  : branchId === 8
                    ? '/rooms/branch-8/Type17/branch8-1.jpg'
                    : branchId === 9
                      ? '/rooms/branch-9/Type10/branch9-1.jpg'
                      : branchId === 11
                        ? '/rooms/branch-11/Type8/branch11-1.jpg'
                        : branchId === 12
                          ? '/rooms/branch-12/Type7/branch12-1.jpg'
                          : branchId === 14
                            ? '/rooms/branch-14/Type13/branch14-1.png'
                            : '/rooms/branch-1/Type1/branch1-1.jpg';
      setImages(prev => prev.map((s, i) => (i === index ? safeSrc : s)));
    }
  };

  if (isLoading) {
    return (
      <div className="room-detail-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="room-detail-error">
        <div className="error-content">
          <h2>Có lỗi xảy ra</h2>
          <p>{error || 'Không tìm thấy phòng'}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-detail">
      <Meta
        title={`${room.BranchName || (room as any).branchName} - ${room.TypeName || (room as any).typeName}`}
        description={`Phòng ${room.TypeName || (room as any).typeName} tại ${(room.BranchName || (room as any).branchName) ?? ''}. Từ ${(room.Price || (room as any).price || 0).toLocaleString('vi-VN')} VND/tháng.`}
        url={`https://younghousehoalac.com/room/${buildRoomSlug(room as any)}`}
        image={(room.Media && room.Media[0]?.FilePath) || '/logo.png'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${room.BranchName || (room as any).branchName} - ${room.TypeName || (room as any).typeName}`,
          image: `https://younghousehoalac.com${(room.Media && room.Media[0]?.FilePath) || '/logo.png'}`,
          description: (room as any).RoomDescription || (room as any).description || 'Phòng trọ YoungHouse tại Hoà Lạc',
          brand: { '@type': 'Brand', name: 'YoungHouse' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: String(room.Price || (room as any).price || 0),
            availability: (room.Status === 'Available') ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://younghousehoalac.com/room/${buildRoomSlug(room as any)}`
          }
        }}
      />
      {/* Header */}
      <div className="room-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="header-actions">
          <button
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="room-images">
        <div className="main-image-container">
          {(() => {
            const current = images[currentImageIndex] || '';
            const useCloudinary = isCloudinaryConfigured();
            
            // Sử dụng Cloudinary nếu đã cấu hình
            if (useCloudinary) {
              return (
                <img
                  src={getCloudinaryUrl(current, { width: 1200, quality: 'auto:good' })}
                  alt={`${room.BranchName}`}
                  className="main-image"
                  loading="eager"
                  decoding="async"
                  onClick={() => setShowImageModal(true)}
                  onError={(e) => {
                    // Fallback to local image if Cloudinary fails
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.startsWith(window.location.origin)) {
                      img.src = current;
                    }
                  }}
                />
              );
            }
            
            // Fallback: sử dụng ảnh local với WebP
            const isBranch6 = current.includes('/rooms/branch-6/');
            if (isBranch6) {
              return (
                <img
                  src={current}
                  alt={`${room.BranchName}`}
                  className="main-image"
                  loading="eager"
                  decoding="async"
                  onClick={() => setShowImageModal(true)}
                  onError={handleImageError(currentImageIndex)}
                />
              );
            }
            const webp = current.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.webp';
            return (
              <picture>
                <source srcSet={webp} type="image/webp" />
                <img
                  src={current}
                  alt={`${room.BranchName}`}
                  className="main-image"
                  loading="eager"
                  decoding="async"
                  onClick={() => setShowImageModal(true)}
                  onError={handleImageError(currentImageIndex)}
                />
              </picture>
            );
          })()}

          {images.length > 1 && (
            <>
              <button className="image-nav prev" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <button className="image-nav next" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>

              <div className="image-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}

          <div className="image-count">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Zoom indicator */}
          <div className="zoom-indicator" onClick={() => setShowImageModal(true)}>
            <ZoomIn size={20} />
            <span>Xem chi tiết</span>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="thumbnail-gallery">
            {images.map((image, index) => {
              const useCloudinary = isCloudinaryConfigured();
              
              // Sử dụng Cloudinary thumbnail nếu đã cấu hình
              if (useCloudinary) {
                return (
                  <img
                    key={index}
                    src={getCloudinaryThumbnail(image, 150)}
                    alt={`Ảnh ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    loading="lazy"
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      // Fallback to local thumbnail
                      const img = e.currentTarget as HTMLImageElement;
                      const thumb = image.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.thumb.jpg';
                      img.src = thumb;
                    }}
                  />
                );
              }
              
              // Fallback: sử dụng ảnh local
              const isBranch6 = image.includes('/rooms/branch-6/');
              const thumb = image.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.thumb.jpg';
              const webp = image.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.webp';
              if (isBranch6) {
                return (
                  <img
                    key={index}
                    src={thumb}
                    alt={`Ảnh ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.src.endsWith('.thumb.jpg')) {
                        img.src = image;
                      } else {
                        img.src = image;
                      }
                    }}
                  />
                );
              }
              return (
                <picture key={index}>
                  <source srcSet={webp} type="image/webp" />
                  <img
                    src={thumb}
                    alt={`Ảnh ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.src.endsWith('.thumb.jpg')) {
                        img.src = image;
                      } else {
                        img.src = webp;
                      }
                    }}
                  />
                </picture>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Top Contact Card (shown under images on mobile) */}
      <div className="contact-card-top">
        <h3>Liên hệ Xem phòng trực tiếp</h3>
        <div className="contact-actions">
          <a className="contact-btn phone" href="tel:0372858098">
            <PhoneIcon size={20} />
            Gọi: 0372858098
          </a>
          <a className="contact-btn zalo" href="https://zalo.me/0372858098" target="_blank" rel="noreferrer">
            <img src="/Zalo.png" alt="Zalo" style={{ width: 16, height: 16 }} />
            Zalo - CTV Xuân Bách
          </a>

          <button
            className="contact-btn book-viewing"
            onClick={() => setShowViewingAppointmentForm(true)}
          >
            <Calendar size={30} />
            ĐẶT LỊCH XEM PHÒNG NGAY
          </button>
        </div>
        <div className="contact-note">Hỗ trợ 24/7  (T2–CN)</div>
      </div>

      {/* Room Information */}
      <div className="room-info-container">
        <div className="room-main-info">
          <div className="room-header">
            <div className="room-title">
              <h1>{room.BranchName}</h1>
              <div className="room-rating">
                <Star size={16} fill="currentColor" />
                <span>4.8 (124 đánh giá)</span>
              </div>
            </div>

            <div className="room-price">
              <span className="price">{formatPrice(room.Price || 0)}</span>
              <span className="period">/tháng</span>
            </div>
          </div>

          <div className="room-location">
            <MapPin size={18} />
            <span>{room.Address}, {room.City}</span>
          </div>

          <div className="room-status">
            <span className={`status-badge ${room.Status === 'Available' ? 'available' : room.Status === 'Reserved' ? 'reserved' : room.Status === 'Occupied' ? 'occupied' : room.Status === 'Maintenance' ? 'maintenance' : 'other'}`}>
              {room.Status === 'Available' ? 'Còn phòng' :
                room.Status === 'Reserved' ? 'Đặt trước' :
                room.Status === 'Occupied' ? 'Hết phòng' :
                room.Status === 'Maintenance' ? 'Bảo trì' : 'Khác'}
            </span>
          </div>

          {/* Room Type & Description */}
          <div className="room-details">
            <h3>Thông tin phòng</h3>
            <div className="detail-item">
              <strong>Loại phòng:</strong> {room.TypeName}
            </div>
            {room.TypeDescription && (
              <div className="detail-item">
                <strong>Mô tả:</strong> {room.TypeDescription}
              </div>
            )}
            {room.RoomDescription && (
              <div className="detail-item">
                <strong>Chi tiết:</strong> {room.RoomDescription}
              </div>
            )}
            <div className="detail-item">
              <strong>Giá dịch vụ:</strong> {formatPrice(getServiceFee(room))}<span className="fee-period">/người/tháng</span>
            </div>
            <div className="detail-item">
              <strong>Giá điện:</strong> {formatPrice(getElectricityFee(room))}<span className="fee-period">/số</span>
            </div>
          </div>

          {/* Offers */}
          <div className="room-offers">
            <h3>QUYỀN LỢI KHÁCH HÀNG MỚI 2025</h3>
            <ul className="offers-list">

              <li>Quà tặng : Tặng Voucher sử dụng 10 sản phẩm bất kì của Young Food & Drink (các món ăn Việt, các món Âu như Pizza, Mỳ Ý… Và các loại nước ép, trà sữa, sinh tố…).
                Tại trụ sở địa điểm + Tặng 10 cốc nước/nước ép hoặc 01 bánh Pizza khi khách hàng tổ chức Sinh nhật tại Young Food & Drink.
              </li>
              <li>Chiết khấu : Giảm 4% tiền thuê nhà khi thanh toán 06 tháng, và giảm 8% tiền thuê nhà khi đóng 12 tháng… khi chuyển khoản trong 48h kể từ ngày kí hợp đồng.
                Lưu ý: Số tiền giảm không bao gồm phí dịch vụ.</li>
            </ul>
          </div>


          {/* Branch video placed above the introduction, if provided */}
          {room.BranchID && branchVideoUrls[room.BranchID] && (
            <div className="branch-video">
              <div className="video-wrapper">
                <iframe
                  src={toYouTubeEmbed(branchVideoUrls[room.BranchID])}
                  title={`Video giới thiệu ${room.BranchName}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {room.BranchID === 1 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 1</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3km, chỉ 7p di chuyển tới trường.</li>
                <li>Tòa nhà 6 tầng với 69 phòng rộng thoáng, tất cả các phòng đều có ban công siêu rộng.</li>
                <li>Chỗ để xe rộng 400m2, cửa khóa vân tay công nghệ cao – siêu an toàn.</li>
                <li>Phòng rộng 25m² dạng gác xép, trang bị đầy đủ thiết bị nội thất giường tủ, bàn học, điều hòa, nóng lạnh, tủ lạnh, thiết bị vệ sinh cao cấp, tủ bếp nấu ăn,…</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: thang máy, khóa vân tay.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
              </ul>
            </div>
          )}


          {room.BranchID === 2 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 2</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 2km, chỉ 5p di chuyển tới trường.</li>
                <li>Tòa nhà có 65 với nhiều dạng phòng cho khách hàng lựa chọn: Phòng 2 ngủ 1 khách, phòng Studio, Phòng đôi, phòng đơn. Chỗ để xe 2 tầng siêu rộng, mỗi tầng 150m2 với cửa khóa vân tay công nghệ cao – siêu an toàn.</li>
                <li>Phòng rộng 20m-40m2 trang bị đầy đủ thiết bị nội thất giường tủ, bàn học, điều hòa, nóng lạnh,  thiết bị vs cao cấp, tủ bếp nấu ăn,…</li>
                <li>Hệ thống phòng đều có ban công hoặc cửa sổ rất thoáng và hành lang cây xanh.</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: 2 thang máy, khóa vân tay, máy giặt free.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Tiện ích xung quanh: có 2 sân chơi thể thao cỏ nhân tạo cạnh tòa nhà, khu tập thể thao công cộng, nhà thuốc, siêu thị.</li>
              </ul>
            </div>
          )}


          {room.BranchID === 4 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 4</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3,5km, thuận lợi tới trường bằng đường nội bộ khu công nghệ cao; nằm ngay gần hồ Tân Xã.</li>
                <li>Tòa nhà có 3 tầng với 18 phòng cửa sổ thoáng mát. Chỗ để xe tầng 1 với cửa khóa vân tay an toàn và khu giặt phơi trên tầng 4.</li>
                <li>Diện tích sử dụng phòng 16–20m². Nội thất gỗ đẹp và cao cấp, trang bị đầy đủ: giường tủ, bàn học, điều hòa, nóng lạnh, thiết bị vệ sinh cao cấp, tủ bếp nấu ăn,…</li>
                <li>Hệ thống phòng đều có cửa sổ rất thoáng, view cửa sổ đẹp, hành lang cây xanh mát mẻ.</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: khóa vân tay, máy giặt free, để xe trong sân.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Lợi ích: Vị trí giao thông đi lại thuận tiện, cách hồ Tân Xã 50m, phù hợp chạy bộ, thể thao, hóng gió…</li>
                <li>Nhà xây mới tinh với trang thiết bị cao cấp.</li>
              </ul>
            </div>
          )}

          {room.BranchID === 8 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 8</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3km, chỉ 7p di chuyển tới trường.</li>
                <li>Tòa nhà 6 tầng với 69 phòng rộng thoáng, tất cả các phòng đều có ban công siêu rộng.</li>
                <li>Chỗ để xe rộng 400m2, cửa khóa vân tay công nghệ cao – siêu an toàn.</li>
                <li>Phòng rộng 25m dạng gác xép, trang bị đầy đủ thiết bị nội thất giường tủ, bàn học, điều hòa, nóng lạnh, tủ lạnh, thiết bị vệ sinh cao cấp, tủ bếp nấu ăn,…</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: thang máy, khóa vân tay.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Tiện ích xung quanh: Khu tập thể thao công cộng, nhà thuốc, siêu thị.</li>
              </ul>
            </div>
          )}

          {room.BranchID === 5 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 5</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3km, chỉ 5p có thể tới trường bằng đường nội bộ khu công nghệ cao rộng thoáng an toàn.</li>
                <li>Tòa nhà có 8 tầng với 46 phòng rộng thoáng. Chỗ để xe tầng 1 siêu rộng với cửa khóa vân tay an toàn và khu giặt phơi trên tầng 7.</li>
                <li>Phòng rộng 18m-30m với nhiều dạng phòng: Giường đơn, giường đôi, phòng cho nhóm bạn 3-4 người, phòng gác xép (trang bị đầy đủ thiết tủ lạnh, bếp từ, bàn học, điều hòa, nóng lạnh, thiết bị vệ sinh cao cấp, tủ bếp nấu ăn).</li>
                <li>Hệ thống phòng đều có cửa sổ rất thoáng và hành lang cây xanh.</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: thang máy, khóa vân tay, máy giặt free.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
              </ul>
            </div>
          )}


          {room.BranchID === 9 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 9</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3,5km, chỉ 7p di chuyển tới trường.</li>
                <li>Tòa nhà có 6 tầng với 39 phòng, đặc biệt tất cả các phòng đều có ban công rộng và thoáng. Có 2 tầng để xe siêu rộng, mỗi tầng 200m², có cửa khóa vân tay an toàn và khu giặt phơi trên tầng 6.</li>
                <li>Phòng rộng 20–25m², trang bị đầy đủ thiết bị nội thất giường tủ, bàn học, điều hòa nóng lạnh, thiết bị vệ sinh cao cấp, tủ bếp nấu ăn,…</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: thang máy, khóa vân tay, máy giặt free.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Tiện ích xung quanh: Cách điểm xe bus 200m, cách siêu thị Đức Thành 500m, gần quán ăn, nhà thuốc, cây xăng,…</li>
              </ul>
            </div>
          )}


          {room.BranchID === 10 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 10</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3km, chỉ 7p di chuyển tới trường.</li>
                <li>Tòa nhà có 4 tầng với 29 phòng rộng thoáng.</li>
                <li>Phòng rộng 20–25m², trang bị đầy đủ thiết bị nội thất giường tủ, bàn học, điều hòa, nóng lạnh, tủ bếp nấu ăn, thiết bị vệ sinh,…</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: khóa vân tay, máy giặt free.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Tiện ích xung quanh: Khu thể thao công cộng, nhà thuốc, quán ăn, chợ.</li>
              </ul>
            </div>
          )}


          {room.BranchID === 11 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 11</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 2km, chỉ 5p di chuyển tới trường.</li>
                <li>Tòa nhà có 6 tầng với 34 phòng rộng thoáng.</li>
                <li>Phòng rộng 25–30m², trang bị đầy đủ thiết bị nội thất: giường tủ, sofa, tủ lạnh, bàn học, điều hòa, nóng lạnh, thiết bị vệ sinh, bàn bếp nấu ăn.</li>
                <li>Tiện ích tòa nhà: khóa vân tay, máy giặt free.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Tiện ích xung quanh: khu thể thao công cộng, nhà thuốc, quán ăn, chợ.</li>
              </ul>
            </div>
          )}


          {room.BranchID === 12 && (
            <div className="branch-intro">
              <h3>Giới thiệu Young House 12</h3>
              <ul>
                <li>Vị trí rất thuận lợi cách trường FPT 3km, chỉ 7p di chuyển tới trường.</li>
                <li>Tòa nhà 6 tầng với 80 phòng rộng thoáng, tất cả các phòng đều có ban công siêu rộng.</li>
                <li>Chỗ để xe rộng 400m², cửa khóa vân tay công nghệ cao – siêu an toàn.</li>
                <li>Phòng rộng 30–40m² dạng gác xép, trang bị đầy đủ thiết bị nội thất: giường tủ, bàn học, điều hòa, nóng lạnh, tủ lạnh, thiết bị vệ sinh cao cấp, tủ bếp nấu ăn,…</li>
                <li>Internet tốc độ cao tới từng phòng.</li>
                <li>Tiện ích tòa nhà: thang máy, khóa vân tay.</li>
                <li>Hệ thống an ninh ra vào cửa bằng khóa vân tay. Hệ thống phòng cháy chữa cháy theo tiêu chuẩn và camera an ninh full tòa nhà.</li>
                <li>Tiện ích xung quanh: có 2 sân chơi thể thao cỏ nhân tạo cạnh tòa nhà, khu tập thể thao công cộng, nhà thuốc, siêu thị.</li>
              </ul>
            </div>
          )}

          {/* Google Maps Section */}
          {room && (
            <div className="map-section">
              <div className="container">
                <GoogleMapEmbed
                  branchId={room.BranchID || room.branchId}
                  branchName={room.BranchName || room.branchName || ''}
                  address={room.Address || room.address || ''}
                  className="room-map"
                />
              </div>
            </div>
          )}

          {/* Surrounding Areas Section */}
          {room && (
            <div className="surrounding-section">
              <div className="container">
                <SurroundingAreas
                  branchId={room.BranchID || room.branchId}
                  branchName={room.BranchName || room.branchName || ''}
                  className="room-surrounding"
                />
              </div>
            </div>
          )}

          {/* Room Reviews Section */}
          {room && (
            <div className="reviews-section">
              <div className="container">
                <RoomReviews
                  roomId={room.roomId || room.RoomID || 0}
                  roomName={`${room.BranchName || room.branchName} - ${room.TypeName || room.typeName}`}
                />
              </div>
            </div>
          )}

          {/* Contact Methods moved to sidebar */}
        </div>

        {/* Right sidebar: Contact card */}
        <aside className="contact-sidebar">
          <div className="contact-card-side">
            <h3>Liên hệ Xem phòng trực tiếp</h3>
            <div className="contact-actions">

              <a className="contact-btn phone" href="tel:0372858098">
                <PhoneIcon size={20} />
                Gọi: 0372858098
              </a>
              <a className="contact-btn zalo" href="https://zalo.me/0372858098" target="_blank" rel="noreferrer">
                <img src="/Zalo.png" alt="Zalo" style={{ width: 18, height: 18 }} />
                Zalo - CTV Xuân Bách
              </a>

              {/* New button to open viewing appointment form */}
              <button
                className="contact-btn book-viewing"
                onClick={() => setShowViewingAppointmentForm(true)}
              >
                <Calendar size={30} />
                ĐẶT LỊCH XEM PHÒNG NGAY
              </button>
            </div>
            <div className="contact-note">Hỗ trợ 24/7  (T2–CN)</div>
          </div>
        </aside>
      </div>

      {/* Similar Rooms Section */}
      <div className="similar-rooms-section">
        <div className="container">
          <h2>Đề xuất cho bạn</h2>
          <div className="similar-rooms-grid">
            {allRooms
              .filter(similarRoom => {
                if (similarRoom.RoomID === room.RoomID) return false;

                // Show all rooms regardless of status

                // Same room type
                const sameType = similarRoom.RoomTypeID === room.RoomTypeID;

                // Similar price range (within 1-2tr or 2-3tr range)
                const currentPrice = room.Price || 0;
                const similarPrice = similarRoom.Price || 0;

                let samePriceRange = false;
                if (currentPrice <= 2000000 && similarPrice <= 2000000) {
                  samePriceRange = true; // Both in 1-2tr range
                } else if (currentPrice > 2000000 && currentPrice <= 3000000 &&
                  similarPrice > 2000000 && similarPrice <= 3000000) {
                  samePriceRange = true; // Both in 2-3tr range
                }

                return sameType || samePriceRange;
              })
              .slice(0, 4)
              .map((similarRoom) => (
                <div
                  key={similarRoom.RoomID}
                  className="similar-room-card"
                  onClick={() => {
                    navigate(`/room/${buildRoomSlug(similarRoom as any)}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="similar-room-image">
                    <img
                      src={isCloudinaryConfigured() 
                        ? getCloudinaryUrl(getRoomImages(similarRoom)[0], { width: 400, quality: 'auto:good' })
                        : getRoomImages(similarRoom)[0]
                      }
                      alt={`${similarRoom.BranchName}`}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to local image
                        const img = e.currentTarget as HTMLImageElement;
                        img.src = getRoomImages(similarRoom)[0];
                      }}
                    />
                  </div>
                  <div className="similar-room-info">
                    <h3>{similarRoom.BranchName}</h3>
                    <p className="similar-room-branch">{similarRoom.BranchName}</p>
                    <p className="similar-room-type">{similarRoom.TypeName}</p>
                    <p className="similar-room-price">{formatPrice(similarRoom.Price || 0)}/tháng</p>
                    <span className={`similar-room-status ${similarRoom.Status === 'Available' ? 'available' : similarRoom.Status === 'Reserved' ? 'reserved' : similarRoom.Status === 'Occupied' ? 'occupied' : similarRoom.Status === 'Maintenance' ? 'maintenance' : 'other'}`}>
                      {similarRoom.Status === 'Available' ? 'Còn phòng' :
                        similarRoom.Status === 'Reserved' ? 'Đặt trước' :
                        similarRoom.Status === 'Occupied' ? 'Hết phòng' :
                        similarRoom.Status === 'Maintenance' ? 'Bảo trì' : 'Khác'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Viewing Appointment Form Modal */}
      {showViewingAppointmentForm && room && (
        <ViewingAppointmentForm
          isOpen={showViewingAppointmentForm}
          room={room}
          onClose={() => setShowViewingAppointmentForm(false)}
          roomId={room.roomId || room.RoomID}
        />
      )}

      {/* Image Lightbox Modal */}
      {showImageModal && (
        <div 
          className="image-modal" 
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close" 
              onClick={() => setShowImageModal(false)}
              aria-label="Đóng"
            >
              <X size={24} />
            </button>

            {images.length > 1 && (
              <button 
                className="modal-nav prev" 
                onClick={prevImage}
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            <img
              src={(() => {
                const current = images[currentImageIndex] || '';
                if (isCloudinaryConfigured()) {
                  return getCloudinaryUrl(current, { width: 1600, quality: 'auto:best' });
                }
                return current;
              })()}
              alt={`${room.BranchName} - Ảnh ${currentImageIndex + 1}`}
              className="modal-image"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                const current = images[currentImageIndex] || '';
                if (!img.src.startsWith(window.location.origin)) {
                  img.src = current;
                }
              }}
            />

            {images.length > 1 && (
              <button 
                className="modal-nav next" 
                onClick={nextImage}
                aria-label="Ảnh tiếp theo"
              >
                <ChevronRight size={32} />
              </button>
            )}

            <div className="modal-counter">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail strip in modal */}
            <div className="modal-thumbnails">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={isCloudinaryConfigured() 
                    ? getCloudinaryThumbnail(image, 80)
                    : image.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.thumb.jpg'
                  }
                  alt={`Ảnh ${index + 1}`}
                  className={`modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.src = image;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;