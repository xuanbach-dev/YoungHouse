import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Post, Room } from '../types';
import { Search, MapPin, Calendar, DollarSign, Eye, Loader2, Leaf, Lightbulb, Utensils, WashingMachine, Shirt, Gift, Sofa, Briefcase, Bed, Shield, Building2, Users, MessageSquare, Headphones } from 'lucide-react';
import ViewingAppointmentForm from '../components/ViewingAppointmentForm';
import './Home.css';

interface RoomType {
  RoomTypeID: number;
  TypeName: string;
  Price: number;
  Description: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [searchForm, setSearchForm] = useState({
    area: '',
    roomTypeId: '',
    priceRange: '',
    status: 'Available'
  });
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchPosts();
    initRoomTypes();
    initRooms();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postsAPI.getPosts(1, 10);
      setPosts(response.data.posts);
    } catch (err: any) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Available areas and their corresponding branch IDs
  const availableAreas = [
    { name: 'Tân Xã', branchIds: [1, 4, 7, 8] },
    { name: 'Phú Hữu', branchIds: [2, 11, 12, 14] },
    { name: 'Bình Yên', branchIds: [9, 10] }
  ];

  const initRoomTypes = () => {
    const localRoomTypes: RoomType[] = [
      { RoomTypeID: 1, TypeName: 'Giường đôi', Price: 2200000, Description: '' },
      { RoomTypeID: 3, TypeName: '2 giường đơn có ban công', Price: 2600000, Description: '' },
      { RoomTypeID: 4, TypeName: '2 giường đơn có giếng trời', Price: 2400000, Description: '' },
      { RoomTypeID: 5, TypeName: '1 giường đôi căn góc', Price: 2600000, Description: '' },
      { RoomTypeID: 7, TypeName: 'Giường gác xép', Price: 2500000, Description: '' },
      { RoomTypeID: 8, TypeName: 'Giường gác xép có ban công', Price: 2500000, Description: '' },
      { RoomTypeID: 10, TypeName: 'Giường đôi (branch 9)', Price: 1800000, Description: '' },
      { RoomTypeID: 11, TypeName: 'Giường đôi (branch 10)', Price: 1500000, Description: '' },
      { RoomTypeID: 12, TypeName: 'Giường đôi (branch 4)', Price: 2200000, Description: '' },
      { RoomTypeID: 13, TypeName: 'Giường gác xép (branch 14)', Price: 1700000, Description: '' },
    ];
    setRoomTypes(localRoomTypes);
  };

  const initRooms = () => {
    // Local mock rooms aligned with SystemHome mapping
    const localRooms: Room[] = [
      { RoomID: 1, roomId: 1, roomNumber: '101', BranchID: 1, branchId: 1, BranchName: 'Young House 1', branchName: 'Young House 1', TypeName: 'Giường đôi', typeName: 'Giường đôi', Price: 2200000, price: 2200000, Status: 'Available', isAvailable: true, Address: '57 đường Xóm Quán – H10, xã Tân Xã', address: '57 đường Xóm Quán – H10, xã Tân Xã', City: 'Hà Nội', RoomTypeID: 1, roomTypeId: 1 },
      { RoomID: 2, roomId: 2, roomNumber: '201', BranchID: 2, branchId: 2, BranchName: 'Young House 2', branchName: 'Young House 2', TypeName: 'Giường đôi căn góc thoáng', typeName: 'Giường đôi căn góc thoáng', Price: 2600000, price: 2600000, Status: 'Available', isAvailable: true, Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã', City: 'Hà Nội', RoomTypeID: 5, roomTypeId: 5 },
      { RoomID: 3, roomId: 3, roomNumber: '202', BranchID: 2, branchId: 2, BranchName: 'Young House 2', branchName: 'Young House 2', TypeName: '2 giường đơn có ban công', typeName: '2 giường đơn có ban công', Price: 2600000, price: 2600000, Status: 'Available', isAvailable: true, Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã', City: 'Hà Nội', RoomTypeID: 3, roomTypeId: 3 },
      { RoomID: 4, roomId: 4, roomNumber: '203', BranchID: 2, branchId: 2, BranchName: 'Young House 2', branchName: 'Young House 2', TypeName: '2 giường đơn có giếng trời', typeName: '2 giường đơn có giếng trời', Price: 2400000, price: 2400000, Status: 'Available', isAvailable: true, Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã', City: 'Hà Nội', RoomTypeID: 4, roomTypeId: 4 },
      { RoomID: 5, roomId: 5, roomNumber: '301', BranchID: 4, branchId: 4, BranchName: 'Young House 4', branchName: 'Young House 4', TypeName: 'Giường đôi có hành lang view hồ Tân Xã', typeName: 'Giường đôi có hành lang view hồ Tân Xã', Price: 2200000, price: 2200000, Status: 'Available', isAvailable: true, Address: '85 Mục Uyên – Công Nghệ, Tân Xã ', address: '85 Mục Uyên – Công Nghệ, Tân Xã ', City: 'Hà Nội', RoomTypeID: 12, roomTypeId: 12 },
      { RoomID: 6, roomId: 6, roomNumber: '401', BranchID: 9, branchId: 9, BranchName: 'Young House 9', branchName: 'Young House 9', TypeName: 'Giường đôi có ban công thoáng', typeName: 'Giường đôi có ban công thoáng', Price: 1800000, price: 1800000, Status: 'Available', isAvailable: true, Address: 'Bình Yên', address: 'Bình Yên', City: 'Hà Nội', RoomTypeID: 10, roomTypeId: 10 },
      { RoomID: 7, roomId: 7, roomNumber: '402', BranchID: 10, branchId: 10, BranchName: 'Young House 10', branchName: 'Young House 10', TypeName: 'Giường đôi', typeName: 'Giường đôi', Price: 1500000, price: 1500000, Status: 'Available', isAvailable: true, Address: 'Bình Yên', address: 'Bình Yên', City: 'Hà Nội', RoomTypeID: 11, roomTypeId: 11 },
      { RoomID: 8, roomId: 8, roomNumber: '501', BranchID: 11, branchId: 11, BranchName: 'Young House 11', branchName: 'Young House 11', TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng', Price: 2500000, price: 2500000, Status: 'Available', isAvailable: true, Address: 'Phú Hữu', address: 'Phú Hữu', City: 'Hà Nội', RoomTypeID: 8, roomTypeId: 8 },
      { RoomID: 9, roomId: 9, roomNumber: '601', BranchID: 12, branchId: 12, BranchName: 'Young House 12', branchName: 'Young House 12', TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng', Price: 2500000, price: 2500000, Status: 'Available', isAvailable: true, Address: 'Phú Hữu', address: 'Phú Hữu', City: 'Hà Nội', RoomTypeID: 7, roomTypeId: 7 },
      { RoomID: 10, roomId: 10, roomNumber: '701', BranchID: 14, branchId: 14, BranchName: 'Young House 14', branchName: 'Young House 14', TypeName: 'Giường gác xép có cửa sổ thoáng', typeName: 'Giường gác xép có cửa sổ thoáng', Price: 1700000, price: 1700000, Status: 'Available', isAvailable: true, Address: 'Phú Hữu', address: 'Phú Hữu', City: 'Hà Nội', RoomTypeID: 13, roomTypeId: 13 },
      // Added Tân Xã: Young House 5, 7, 8
      // { RoomID: 11, roomId: 11, roomNumber: '801', BranchID: 5, branchId: 5, BranchName: 'Young House 5', branchName: 'Young House 5', TypeName: 'Giường đôi có ban công thoáng', typeName: 'Giường đôi có ban công thoáng', Price: 2000000, price: 2000000, Status: 'Available', isAvailable: true, Address: '23 Mục Uyên – Công nghệ - Tân Xã', address: '23 Mục Uyên – Công nghệ - Tân Xã', City: 'Hà Nội', RoomTypeID: 15, roomTypeId: 15 },
      { RoomID: 12, roomId: 12, roomNumber: '901', BranchID: 7, branchId: 7, BranchName: 'Young House 7', branchName: 'Young House 7', TypeName: 'Giường đôi có ban công thoáng', typeName: 'Giường đôi có ban công thoáng', Price: 2400000, price: 2400000, Status: 'Available', isAvailable: true, Address: 'Đối diện THPT Hai Bà Trưng - Tân Xã', address: 'Đối diện THPT Hai Bà Trưng - Tân Xã', City: 'Hà Nội', RoomTypeID: 16, roomTypeId: 16 },
      { RoomID: 13, roomId: 13, roomNumber: '1001', BranchID: 8, branchId: 8, BranchName: 'Young House 8', branchName: 'Young House 8', TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng', Price: 2200000, price: 2200000, Status: 'Available', isAvailable: true, Address: '41 Mục Uyên 1, xã Tân Xã', address: '41 Mục Uyên 1, xã Tân Xã', City: 'Hà Nội', RoomTypeID: 17, roomTypeId: 17 },
    ];
    setRooms(localRooms);
  };

  const getImagePath = (room: Room) => {
    const branchId = room.BranchID || (room as any).branchId;
    const typeId = room.RoomTypeID || (room as any).roomTypeId;

    switch (branchId) {
      case 1: {
        const i = 1 + Math.floor(Math.random() * 9);
        return `/rooms/branch-1/Type1/branch1-${i}.${i === 9 ? 'JPG' : 'jpg'}`;
      }
      case 5: {
        // Available images: 1-10, 12, 13
        const candidates = [1,2,9,10,12,13];
        const i = candidates[Math.floor(Math.random() * candidates.length)];
        return `/rooms/branch-5/Type15/branch5-${i}.jpg`;
      }
      case 2: {
        if (typeId === 5) { const i = 1 + Math.floor(Math.random() * 7); return `/rooms/branch-2/Type5/branch2-1-${i}.JPG`; }
        if (typeId === 3) { const i = 1 + Math.floor(Math.random() * 4); return `/rooms/branch-2/Type3/branch2-2-${i}.JPG`; }
        if (typeId === 4) { const i = 1 + Math.floor(Math.random() * 2); return `/rooms/branch-2/Type4/branch2-3-${i}.JPG`; }
        const i = 1 + Math.floor(Math.random() * 7); return `/rooms/branch-2/Type5/branch2-1-${i}.JPG`;
      }
      case 4: { const i = 1 + Math.floor(Math.random() * 6); return `/rooms/branch-4/Type12/branch4-${i}.jpg`; }
      case 7: { const i = 1 + Math.floor(Math.random() * 6); return `/rooms/branch-7/Type16/branch7-${i}.png`; }
      case 8: { const i = 1 + Math.floor(Math.random() * 6); return `/rooms/branch-8/Type17/branch8-${i}.jpg`; }
      case 9: { const i = 1 + Math.floor(Math.random() * 9); return `/rooms/branch-9/Type10/branch9-${i}.${i >= 8 ? 'JPG' : 'jpg'}`; }
      case 10: { const i = 1 + Math.floor(Math.random() * 6); return `/rooms/branch-10/Type11/branch10-${i}.jpg`; }
      case 11: { const i = 1 + Math.floor(Math.random() * 7); return `/rooms/branch-11/Type8/branch11-${i}.jpg`; }
      case 12: { const i = 1 + Math.floor(Math.random() * 9); return `/rooms/branch-12/Type7/branch12-${i}.jpg`; }
      case 14: { const i = 1 + Math.floor(Math.random() * 8); return `/rooms/branch-14/Type13/branch14-${i}.png`; }
      default: return `/rooms/branch-1/Type1/branch1-1.jpg`;
    }
  };

  const handleSearchFormChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setError(null);
      
      const results = rooms.filter((room) => {
        const byArea = !searchForm.area || (() => {
          const area = availableAreas.find(a => a.name === searchForm.area);
          const branchId = room.BranchID || (room as any).branchId;
          return area ? area.branchIds.includes(branchId as number) : true;
        })();
        const byType = !searchForm.roomTypeId || (room.RoomTypeID === parseInt(searchForm.roomTypeId));
        const byStatus = !searchForm.status || (room.Status === searchForm.status);
        let byPrice = true;
      if (searchForm.priceRange) {
        const [min, max] = searchForm.priceRange.split('-').map(Number);
          const price = room.Price || 0;
          const minV = (min || 0) * 1000000;
          const maxV = (max || 0) * 1000000;
          byPrice = max === 0 ? price >= minV : (price >= minV && price <= maxV);
        }
        return byArea && byType && byStatus && byPrice;
      });

      setSearchResults(results);
      setHasSearched(true);
      
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
      console.error('Error searching rooms:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
    setSearchForm({
      area: '',
      roomTypeId: '',
      priceRange: '',
      status: 'Available'
    });
  };

  const handleViewingAppointment = (room: Room) => {
    setSelectedRoom(room);
    setIsAppointmentFormOpen(true);
  };

  const closeAppointmentForm = () => {
    setIsAppointmentFormOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Nhà trọ tiện nghi</h1>
            <h2>Cư dân YoungHouse</h2>
            <p>
              Khi nhà trọ cũng là nhà, YoungHouse tin rằng một không gian tiện nghi, 
              lối sống văn minh là nền móng để cư dân trẻ có thể tự do sống tích cực 
              và thành công trong cuộc sống.
            </p>
            <p className="hero-subtitle">
            Young House - Hệ thống nhà cho thuê Lớn và Uy tín nhất Hòa Lạc ❤️

            </p>
            
            <div className="search-form">
              <div className="search-field">
                <label>Khu vực</label>
                <select 
                  value={searchForm.area}
                  onChange={(e) => handleSearchFormChange('area', e.target.value)}
                >
                  <option value="">Tất cả khu vực</option>
                  {availableAreas.map((area) => (
                    <option key={area.name} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* <div className="search-field">
                <label>Loại phòng</label>
                <select 
                  value={searchForm.roomTypeId}
                  onChange={(e) => handleSearchFormChange('roomTypeId', e.target.value)}
                >
                  <option value="">Tất cả loại phòng</option>
                  {roomTypes.map((roomType) => (
                    <option key={roomType.RoomTypeID} value={roomType.RoomTypeID}>
                      {roomType.TypeName} - {roomType.Price?.toLocaleString('vi-VN')} VND
                    </option>
                  ))}
                </select>
              </div> */}
              
              <div className="search-field">
                <label>Khoảng giá</label>
                <select 
                  value={searchForm.priceRange}
                  onChange={(e) => handleSearchFormChange('priceRange', e.target.value)}
                >
                  <option value="">Tất cả mức giá</option>
                  <option value="0-1.5">Từ 1.5 triệu</option>
                  <option value="1.5-2">Từ 1.5-2 triệu</option>
                  <option value="2-2.5">Từ 2- 2.5 triệu</option>
                  <option value="2.5-3">Từ 2.5- 3 triệu</option>
                  
                </select>
              </div>
              
              <div className="search-field">
                <label>Trạng thái</label>
                <select 
                  value={searchForm.status}
                  onChange={(e) => handleSearchFormChange('status', e.target.value)}
                >
                  
                  <option value="Available">Có sẵn</option>
                  
                </select>
              </div>
              
              <button 
                className="search-button" 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
                {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>

              {hasSearched && (
                <button 
                  className="reset-button" 
                  onClick={resetSearch}
                  style={{ 
                    marginLeft: '10px',
                    padding: '10px 15px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
          
          <div className="hero-image">
            <div className="room-showcase">
              <div className="room-image-placeholder">
                <img 
                  src="/logo.png" 
                  alt="Young House Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="amenities-section">
        <div className="container">
          <h2 className="amenities-title">Không gian sống tiện nghi</h2>
          <p className="amenities-subtitle">
            Môi trường sống phát triển, văn minh, hiện đại làm nên tăng sống cho mỗi người thức 
            hiện mọi mục tiêu các nhân trong cuộc sống
          </p>
          
          <div className="amenities-grid">
            <div className="amenity-item">
              <div className="amenity-icon">
                <Leaf size={24} />
              </div>
              <span>Cây xanh</span>
            </div>
            
           
            
            <div className="amenity-item">
              <div className="amenity-icon">
                <WashingMachine size={24} />
              </div>
              <span>Máy giặt</span>
            </div>
            
            <div className="amenity-item">
              <div className="amenity-icon">
                <Shirt size={24} />
              </div>
              <span>Tủ quần áo</span>
            </div>
            
            <div className="amenity-item">
              <div className="amenity-icon">
                <Gift size={24} />
              </div>
              <span>Bếp nấu ăn</span>
            </div>
            
            
            <div className="amenity-item">
              <div className="amenity-icon">
                <Bed size={24} />
              </div>
              <span>Giường</span>
            </div>
            
            <div className="amenity-item">
              <div className="amenity-icon">
                <Shield size={24} />
              </div>
              <span>An ninh 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container">
          <h2 className="values-title">Giá trị Young House</h2>
          
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <Building2 size={32} />
              </div>
              <h3>Nhà trọ sáng, thoáng, kết cấu chắc chắn</h3>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <Users size={32} />
              </div>
              <h3>Phòng trọ tiện nghi, thiết kế tối giản, gọn gàng</h3>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <MessageSquare size={32} />
              </div>
              <h3>Cộng đồng sinh viên FPT năng động, hoà đồng</h3>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <Headphones size={32} />
              </div>
              <h3>Quản lý hỗ trợ 24/7, luôn có mặt hỗ trợ cư dân Young House</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {hasSearched && (
        <div id="search-results" className="search-results-section">
          <div className="container">
            <h2>
              Kết quả tìm kiếm 
              {searchResults.length > 0 && (
                <span style={{ color: '#666', fontSize: '0.9em', fontWeight: 'normal' }}>
                  ({searchResults.length} phòng)
                </span>
              )}
            </h2>
            
            {error && (
              <div style={{ 
                color: '#dc3545', 
                background: '#f8d7da', 
                padding: '10px', 
                borderRadius: '5px', 
                marginBottom: '20px' 
              }}>
                {error}
              </div>
            )}
            
            {searchResults.length === 0 && !isSearching && !error && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666' 
              }}>
                <p>Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm.</p>
                <p>Vui lòng thử điều chỉnh bộ lọc tìm kiếm.</p>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="rooms-grid">
                {searchResults.map((room) => (
                  <div key={room.RoomID || (room as any).roomId} className="room-card" onClick={() => window.location.href = `/rooms/${room.RoomID}` }>
                    <div className="room-image">
                      <img 
                        src={getImagePath(room)}
                        alt={`Phòng ${room.RoomNumber || (room as any).roomNumber}`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
                          e.currentTarget.parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;">Hình ảnh phòng</div>';
                        }}
                      />
                    </div>
                    <div className="room-info">
                      <h3>Phòng {room.RoomNumber}</h3>
                      <p className="room-type">{room.TypeName}</p>
                      <p className="room-location">
                        <MapPin size={14} />
                        {room.BranchName}
                      </p>
                      <p className="room-price">
                        <DollarSign size={14} />
                        {room.Price?.toLocaleString('vi-VN')} VND/tháng
                      </p>
                      <p className={`room-status ${(room.Status || '').toLowerCase()}`}>
                        Trạng thái: {
                          room.Status === 'Available' ? 'Có sẵn' :
                          room.Status === 'Occupied' ? 'Đã thuê' :
                          room.Status === 'Maintenance' ? 'Bảo trì' :
                          room.Status === 'Reserved' ? 'Đã đặt' :
                          room.Status
                        }
                      </p>
                      <div className="room-actions">
                        <button 
                          className="appointment-button"
                          onClick={() => handleViewingAppointment(room)}
                          disabled={room.Status !== 'Available'}
                        >
                          <Eye size={16} />
                          {room.Status === 'Available' ? 'Hẹn lịch xem phòng' : 'Không khả dụng'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured rooms from local */}
      {!isLoading && !error && rooms.length > 0 && !hasSearched && (
        <div className="featured-rooms">
          <div className="container">
            <h2>Phòng nổi bật</h2>
            <div className="rooms-grid">
              {rooms.slice(0, 6).map((room) => (
                <div key={room.RoomID} className="room-card" onClick={() => window.location.href = `/rooms/${room.RoomID}` }>
                  <div className="room-image">
                    <img 
                      src={getImagePath(room)}
                      alt={`Phòng ${room.RoomNumber}`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
                        e.currentTarget.parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;">Hình ảnh phòng</div>';
                      }}
                    />
                  </div>
                  <div className="room-info">
                    <h3>Phòng {room.RoomNumber}</h3>
                    <p className="room-type">{room.TypeName}</p>
                    <p className="room-location">
                      <MapPin size={14} />
                      {room.BranchName}
                    </p>
                    <p className="room-price">
                      <DollarSign size={14} />
                      {room.Price?.toLocaleString('vi-VN')} VND/tháng
                    </p>
                    <div className="room-actions">
                      <button 
                        className="appointment-button"
                        onClick={() => handleViewingAppointment(room)}
                      >
                        <Eye size={16} />
                        Hẹn lịch xem phòng
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ViewingAppointmentForm
        isOpen={isAppointmentFormOpen}
        onClose={closeAppointmentForm}
        roomId={selectedRoom?.RoomID || (selectedRoom as any)?.roomId}
        room={selectedRoom || undefined}
      />
    </div>
  );
};

export default Home;