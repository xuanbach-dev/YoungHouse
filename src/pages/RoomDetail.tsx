import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Wifi, 
  AirVent, 
  Fingerprint, 
  Droplets,
  ChevronLeft,
  ChevronRight,
  X,
  Phone as PhoneIcon,
  Mail,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';
// import { roomsAPI } from '../services/api';
import { Room } from '../types';
// Removed ViewingAppointmentForm
import './RoomDetail.css';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  // const [showViewingAppointmentForm, setShowViewingAppointmentForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageAttempts, setImageAttempts] = useState<Record<number, number>>({});
  
  // Local mock rooms (sync minimal fields with SystemHome local data)
  const localRooms: Room[] = [
    {
      RoomID: 1,
      roomId: 1,
      RoomNumber: '101',
      roomNumber: '101',
      BranchID: 1,
      branchId: 1,
      BranchName: 'Young House 1',
      branchName: 'Young House 1',
      TypeName: 'Giường đôi',
      typeName: 'Giường đôi',
      Price: 3500000,
      price: 3500000,
      Status: 'Available',
      Address: '57 đường Xóm Quán – H10, xã Tân Xã',
      City: 'Hà Nội',
      Media: [{ FilePath: '/rooms/branch-1/Type1/branch1-1.jpg' }],
      RoomTypeID: 1,
      roomTypeId: 1,
      isAvailable: true,
    },{
      RoomID: 2,
      roomId: 2,
      RoomNumber: 'Young House 2',
      roomNumber: 'Young House 2',
      BranchID: 2,
      branchId: 2,
      BranchName: 'Young House 2',
      branchName: 'Young House 2',
      TypeName: 'Giường đôi căn góc thoáng',
      typeName: 'Giường đôi căn góc thoáng',
      Price: 2600000,
      price: 2600000,
      Status: 'Available',
      isAvailable: true,
      Address: '64 Phú Hữu, xã Tân Xã',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 5,
      roomTypeId: 5
    },
    {
      RoomID: 3,
      roomId: 3,
      RoomNumber: 'Young House 2',
      roomNumber: 'Young House 2',
      BranchID: 2,
      branchId: 2,
      BranchName: 'Young House 2',
      branchName: 'Young House 2',
      TypeName: 'Giường đôi căn góc thoáng',
      typeName: 'Giường đôi căn góc thoáng',
      Price: 2600000,
      price: 2600000,
      Status: 'Available',
      isAvailable: true,
      Address: '64 Phú Hữu, xã Tân Xã',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 3,
      roomTypeId: 3
    },{
      RoomID: 4,
      roomId: 4,
      RoomNumber: 'Young House 2',
      roomNumber: 'Young House 2',
      BranchID: 2,
      branchId: 2,
      BranchName: 'Young House 2',
      branchName: 'Young House 2',
      TypeName: 'Giường đơn có giếng trời thoáng',
      typeName: 'Giường đơn có giếng trời thoáng',
      Price: 2400000,
      price: 2400000,
      Status: 'Available',
      isAvailable: true,
      Address: '64 Phú Hữu, xã Tân Xã',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 4,
      roomTypeId: 4
    },{
      RoomID: 5,
      roomId: 5,
      RoomNumber: 'Young House 4',
      roomNumber: 'Young House 4',
      BranchID: 4,
      branchId: 4,
      BranchName: 'Young House 4',
      branchName: 'Young House 4',
      TypeName: 'Giường đôi có hành lang view hồ Tân Xã',
      typeName: 'Giường đôi có hành lang view hồ Tân Xã',
      Price: 2200000,
      price: 2200000,
      Status: 'Available',
      isAvailable: true,
      Address: 'Địa chỉ Young House 4',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch4/branch4-1.jpg' }],
      RoomTypeID: 12,
      roomTypeId: 12
    },{
      RoomID: 6,
      roomId: 6,
      RoomNumber: 'Young House 9',
      roomNumber: 'Young House 9',
      BranchID: 9,
      branchId: 9,
      BranchName: 'Young House 9',
      branchName: 'Young House 9',
      TypeName: 'Giường đôi có ban công thoáng',
      typeName: 'Giường đôi có ban công thoáng',
      Price: 1800000,
      price: 1800000,
      Status: 'Available',
      isAvailable: true,
      Address: ' D2 – Khu Tái định cư đường 420 xã Bình Yên – Thạch Thất – Hà Nội ',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 10,
      roomTypeId: 10
    },{
      RoomID: 7,
      roomId: 7,
      RoomNumber: 'Young House 10',
      roomNumber: 'Young House 10',
      BranchID: 10,
      branchId: 10,
      BranchName: 'Young House 10',
      branchName: 'Young House 10',
      TypeName: 'Giường đôi có ban công thoáng',
      typeName: 'Giường đôi có ban công thoáng',
      Price: 1500000,
      price: 1500000,
      Status: 'Available',
      isAvailable: true,
      Address: 'Nhà văn hóa thôn Thái Bình, xã Bình Yên.  ',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 11,
      roomTypeId: 11
    },{
      RoomID: 8,
      roomId: 8,
      RoomNumber: 'Young House 11',
      roomNumber: 'Young House 11',
      BranchID: 11,
      branchId: 11,
      BranchName: 'Young House 11',
      branchName: 'Young House 11',
      TypeName: 'Giường gác xép có ban công thoáng',
      typeName: 'Giường gác xép có ban công thoáng',
      Price: 2500000,
      price: 2500000,
      Status: 'Available',
      isAvailable: true,
      Address: 'Số 6, đường Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 8,
      roomTypeId: 8
    },{
      RoomID: 9,
      roomId: 9,
      RoomNumber: 'Young House 12',
      roomNumber: 'Young House 12',
      BranchID: 12,
      branchId: 12,
      BranchName: 'Young House 12',
      branchName: 'Young House 12',
      TypeName: 'Giường gác xép có ban công thoáng',
      typeName: 'Giường gác xép có ban công thoáng',
      Price: 2500000,
      price: 2500000,
      Status: 'Available',
      isAvailable: true,
      Address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 7,
      roomTypeId: 7
    },{
      RoomID: 10,
      roomId: 10,
      RoomNumber: 'Young House 14',
      roomNumber: 'Young House 14',
      BranchID: 14,
      branchId: 14,
      BranchName: 'Young House 14',
      branchName: 'Young House 14',
      TypeName: 'Giường gác xép có cửa sổ thoáng',
      typeName: 'Giường gác xép có cửa sổ thoáng',
      Price: 1700000,
      price: 1700000,
      Status: 'Available',
      isAvailable: true,
      Address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
      City: 'Hà Nội',
      Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
      RoomTypeID: 13,
      roomTypeId: 13
    }
  ];
  
  // Use public images under /public/rooms/branch-<branchId>/TypeX/<filename>
  const getRoomImages = (room: Room): string[] => {
    const branchId = room.BranchID || room.branchId || 1;
    const images: string[] = [];

    // Branch-specific patterns that match your public folder
    if (branchId === 1) {
      // branch-1/Type1/branch1-<i>.jpg (1..9), note last may be .JPG but onError will handle
      for (let i = 1; i <= 9; i++) {
        images.push(`/rooms/branch-1/Type1/branch1-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 2) {
      // Type depends on RoomTypeID: 5->Type5 (branch2-1-i.JPG), 3->Type3 (branch2-2-i.JPG), 4->Type4 (branch2-3-i.JPG)
      const roomTypeId = room.RoomTypeID || (room as any).roomTypeId;
      let typeFolder = 'Type5';
      let prefix = 'branch2-1-';
      let count = 7;
      if (roomTypeId === 3) { typeFolder = 'Type3'; prefix = 'branch2-2-'; count = 4; }
      if (roomTypeId === 4) { typeFolder = 'Type4'; prefix = 'branch2-3-'; count = 2; }
      for (let i = 1; i <= count; i++) {
        images.push(`/rooms/branch-2/${typeFolder}/${prefix}${i}.JPG`);
      }
      return images;
    }

    if (branchId === 4) {
      for (let i = 1; i <= 6; i++) {
        images.push(`/rooms/branch-4/Type12/branch4-${i}.jpg`);
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
      // 6 images: branch10-1.jpg..-6.jpg, plus a special branch10_2.jpg present
      images.push(`/rooms/branch-10/Type11/branch10-1.jpg`);
      images.push(`/rooms/branch-10/Type11/branch10-2.jpg`);
      images.push(`/rooms/branch-10/Type11/branch10-3.jpg`);
      images.push(`/rooms/branch-10/Type11/branch10-4.jpg`);
      images.push(`/rooms/branch-10/Type11/branch10-5.jpg`);
      images.push(`/rooms/branch-10/Type11/branch10-6.jpg`);
      // alt underscore variant for index 2 as fallback via onError
      images.splice(2, 0, `/rooms/branch-10/Type11/branch10_2.jpg`);
      return images;
    }

    if (branchId === 11) {
      for (let i = 1; i <= 7; i++) {
        images.push(`/rooms/branch-11/Type8/branch11-${i}.jpg`);
      }
      return images;
    }

    if (branchId === 12) {
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

    // Fallback
    images.push('/placeholder.png');
    return images;
  };

  useEffect(() => {
    if (!id) return;

    const roomId = parseInt(id, 10);
    setIsLoading(true);
    setError(null);

    // Load from local list instead of API
    const found = localRooms.find(r => r.RoomID === roomId) || null;
    if (found) {
      setRoom(found);
      const imgs = getRoomImages(found);
      setImages(imgs);
      setImageAttempts({});
    } else {
      setError('Không tìm thấy thông tin phòng');
    }
    setIsLoading(false);
  }, [id]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get service fee based on branch (fallback defaults)
  const getServiceFee = (room: Room): number => {
    if ((room as any).ServiceFee || (room as any).serviceFee) {
      return (room as any).ServiceFee || (room as any).serviceFee || 0;
    }
    const b = room.BranchID || room.branchId;
    if (b === 10 || b === 14) return 180000;
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
    const swapExt = (src: string, to: string) => src.replace(/\.(jpg|JPG|png|PNG)$/,'') + '.' + to;

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
      // Give up: set to a simple placeholder
      setImages(prev => prev.map((s, i) => (i === index ? '/placeholder.png' : s)));
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
          <img 
            src={images[currentImageIndex]} 
            alt={`${room.BranchName} - Phòng ${room.RoomNumber}`}
            className="main-image"
            onClick={() => setShowImageModal(true)}
            onError={handleImageError(currentImageIndex)}
          />
          
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
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="thumbnail-gallery">
            {images.map((image, index) => {
              const thumb = image.replace(/\.(jpg|JPG|png|PNG)$/,'') + '.thumb.jpg';
              const webp = image.replace(/\.(jpg|JPG|png|PNG)$/,'') + '.webp';
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

      {/* Room Information */}
      <div className="room-info-container">
        <div className="room-main-info">
          <div className="room-header">
            <div className="room-title">
              <h1>{room.BranchName} - Phòng {room.RoomNumber}</h1>
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
            <span className={`status-badge ${(room.Status || 'Available').toLowerCase()}`}>
              {room.Status === 'Available' ? 'Còn trống' : 
               room.Status === 'Occupied' ? 'Đã thuê' :
               room.Status === 'Reserved' ? 'Đã đặt' : 'Bảo trì'}
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
              <strong>Giá dịch vụ:</strong> {formatPrice(getServiceFee(room))}<span className="fee-period">/tháng</span>
            </div>
            <div className="detail-item">
              <strong>Giá điện:</strong> {formatPrice(getElectricityFee(room))}<span className="fee-period">/số</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="room-amenities">
            <h3>Tiện nghi</h3>
            <div className="amenities-grid">
              <div className="amenity-item">
                <Wifi size={20} />
                <span>WiFi từng phòng</span>
              </div>
              <div className="amenity-item">
                <AirVent size={20} />
                <span>Điều hòa</span>
              </div>
              <div className="amenity-item">
                <Fingerprint size={20} />
                <span>Vân tay toà nhà</span>
              </div>
              <div className="amenity-item">
                <Droplets size={20} />
                <span>Nóng lạnh</span>
              </div>
            </div>
          </div>

          {/* Contact Methods moved to sidebar */}
        </div>

        {/* Right sidebar: Contact card */}
        <aside className="contact-sidebar">
          <div className="contact-card-side">
            <h3>Liên hệ</h3>
            <div className="contact-actions">
              <a className="contact-btn messenger" href="https://www.facebook.com/profile.php?id=100043274418628" target="_blank" rel="noreferrer">
                <MessageCircle size={20} />
                Messenger
              </a>
              <a className="contact-btn phone" href="tel:0372858098">
                <PhoneIcon size={20} />
                Gọi: 0372858098
              </a>
              <a className="contact-btn zalo" href="https://zalo.me/0372858098" target="_blank" rel="noreferrer">
                <img src="/logo.png" alt="Zalo" style={{ width: 18, height: 18 }} />
                Zalo
              </a>
            </div>
            <div className="contact-note">Hỗ trợ 08:00 – 22:00 (T2–CN)</div>
          </div>
        </aside>
      </div>

      {/* Removed ViewingAppointmentForm Modal */}
    </div>
  );
};

export default RoomDetail;