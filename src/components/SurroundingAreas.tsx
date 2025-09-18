import React from 'react';
import { MapPin, GraduationCap, ShoppingCart, Coffee, Car, Building, Utensils } from 'lucide-react';
import './SurroundingAreas.css';

interface SurroundingLocation {
  id: string;
  name: string;
  distance: string;
  type: 'university' | 'shopping' | 'restaurant' | 'coffee' | 'park' | 'transport' | 'other';
  description?: string;
}

interface SurroundingAreasProps {
  branchId: number;
  branchName: string;
  className?: string;
}

const SurroundingAreas: React.FC<SurroundingAreasProps> = ({ 
  branchId, 
  branchName, 
  className = '' 
}) => {

  // Dữ liệu các địa điểm xung quanh cho từng cơ sở
  const getSurroundingLocations = (branchId: number): SurroundingLocation[] => {
    switch (branchId) {
      case 1: // Young House 1
        return [
          { id: 'yh1-1', name: 'Trường Đại học FPT', distance: '3km', type: 'university', description: 'Trường chính' },
          { id: 'yh1-2', name: 'Trường Học viện Tài chính', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh1-3', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5km', type: 'university', description: 'Trường chính' },
          { id: 'yh1-4', name: 'Hồ Tân Xã', distance: '500m', type: 'park', description: 'Khu vui chơi, thể thao' },
          { id: 'yh1-5', name: 'Chợ Tân Xã', distance: '1.2km', type: 'shopping', description: 'Mua sắm hàng ngày' },
          { id: 'yh1-6', name: 'TocoToco Tân Xã', distance: '100m', type: 'coffee', description: 'Học tập, làm việc' },
            { id: 'yh1-7', name: 'Nhà thuốc Tân Xã', distance: '2.5km', type: 'other', description: 'Y tế' }];     
      case 2: // Young House 2
        return [
          { id: 'yh2-1', name: 'Trường Đại học FPT', distance: '2km', type: 'university', description: 'Trường chính' },
          { id: 'yh2-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5km', type: 'university', description: 'Trường chính' },
          { id: 'yh2-3', name: 'Trường Học viện Tài chính', distance: '1.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh2-4', name: 'Sân bóng', distance: '200m', type: 'park', description: 'Thể thao, vui chơi' },
          { id: 'yh2-5', name: 'Chợ Tân Xã', distance: '400m', type: 'shopping', description: 'Mua sắm, ăn uống' },
          { id: 'yh2-6', name: 'An Coffee', distance: '200m', type: 'coffee', description: 'Học tập, gặp gỡ' },  
          { id: 'yh2-7', name: 'FPT Software', distance: '2.5km', type: 'other', description: 'Công ty FPT Software' }
        ];
      
      case 4: // Young House 4
        return [
          { id: 'yh4-1', name: 'Trường Đại học FPT', distance: '3.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh4-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5km', type: 'university', description: 'Trường chính' },
          { id: 'yh4-3', name: 'Trường Học viện Tài chính', distance: '3km', type: 'university', description: 'Trường chính' },
          { id: 'yh4-4', name: 'Hồ Tân Xã', distance: '100m', type: 'park', description: 'Ngay cạnh hồ' },
          { id: 'yh4-4', name: 'Cà phê Nhà Chung', distance: '1km', type: 'coffee', description: 'Học tập, làm việc' },
          { id: 'yh4-5', name: 'FPT Software', distance: '1km', type: 'other', description: 'Công ty FPT Software' }
        ];

        case 5: // Young House 5
        return [
          { id: 'yh5-1', name: 'Trường Đại học FPT', distance: '3.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh5-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh5-3', name: 'Trường Học viện Tài chính', distance: '3.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh5-4', name: 'Hồ Tân Xã', distance: '200m', type: 'park', description: 'Ngay cạnh hồ' },
          { id: 'yh5-5', name: 'Cà phê Nhà Chung', distance: '100m', type: 'coffee', description: 'Học tập, làm việc' },
          { id: 'yh5-6', name: 'FPT Software', distance: '1.5km', type: 'other', description: 'Công ty FPT Software' }
        ];

        case 7: // Young House 7
        return [
          { id: 'yh7-1', name: 'Trường Đại học FPT', distance: '3.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh7-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5km', type: 'university', description: 'Trường chính' },
          { id: 'yh7-3', name: 'Trường Học viện Tài chính', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh7-4', name: 'Hồ Tân Xã', distance: '200m', type: 'park', description: 'Ngay cạnh hồ' },
          { id: 'yh7-5', name: 'Cà phê Nhà Chung', distance: '100m', type: 'coffee', description: 'Học tập, làm việc' },
          { id: 'yh7-6', name: 'FPT Software', distance: '1.7km', type: 'other', description: 'Công ty FPT Software' }
        ];

        case 9: // Young House 9
        return [
          { id: 'yh9-1', name: 'Trường Đại học FPT', distance: '3.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh9-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh9-3', name: 'Trường Học viện Tài chính', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh9-4', name: 'Siêu thị Đức Thành', distance: '200m', type: 'shopping', description: 'Mua sắm' },
          
        ];


        case 10: // Young House 10
        return [
          { id: 'yh10-1', name: 'Trường Đại học FPT', distance: '3.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh10-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh10-3', name: 'Trường Học viện Tài chính', distance: '2km', type: 'university', description: 'Trường chính' },
          { id: 'yh10-4', name: 'Siêu thị Đức Thành', distance: '500m', type: 'shopping', description: 'Mua sắm' },
          { id: 'yh10-5', name: 'Chợ Hoà Lạc', distance: '1km', type: 'shopping', description: 'Mua sắm' },

        ];

        case 11: // Young House 11
        return [
          { id: 'yh11-1', name: 'Trường Đại học FPT', distance: '2km', type: 'university', description: 'Trường chính' },
          { id: 'yh11-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5km', type: 'university', description: 'Trường chính' },
          { id: 'yh11-3', name: 'Trường Học viện Tài chính', distance: '1km', type: 'university', description: 'Trường chính' },
          { id: 'yh11-4', name: 'Siêu thị Huyền Tí ', distance: '500m', type: 'shopping', description: 'Mua sắm' },
          { id: 'yh11-5', name: 'Chợ Hoà Lạc', distance: '1km', type: 'shopping', description: 'Mua sắm' },

        ];

        case 12: // Young House 12
        return [
          { id: 'yh12-1', name: 'Trường Đại học FPT', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh12-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh12-3', name: 'Trường Học viện Tài chính', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh12-4', name: 'Siêu thị Tình Trang ', distance: '100m', type: 'shopping', description: 'Mua sắm' },
          { id: 'yh12-5', name: 'Nhà thờ Phú Hữu', distance: '1km', type: 'other', description: 'Nhà thờ' },
        ];


        case 14: // Young House 14
        return [
          { id: 'yh14-1', name: 'Trường Đại học FPT', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh14-2', name: 'Trường Đại học Quốc gia Hà Nội', distance: '5.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh14-3', name: 'Trường Học viện Tài chính', distance: '2.5km', type: 'university', description: 'Trường chính' },
          { id: 'yh14-4', name: 'Siêu thị Tình Trang ', distance: '100m', type: 'shopping', description: 'Mua sắm' },
          { id: 'yh14-5', name: 'Nhà thờ Phú Hữu', distance: '1km', type: 'other', description: 'Nhà thờ' },
        ];

        default:
        return [
          { id: 'default-1', name: 'Trường Đại học FPT', distance: '3km', type: 'university', description: 'Trường chính' },
          { id: 'default-2', name: 'Hồ Tân Xã', distance: '1km', type: 'park', description: 'Khu vui chơi' },
          { id: 'default-3', name: 'Siêu thị', distance: '2km', type: 'shopping', description: 'Mua sắm' }
        ];
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'university':
        return <GraduationCap size={20} className="location-icon university" />;
      case 'shopping':
        return <ShoppingCart size={20} className="location-icon shopping" />;
      case 'restaurant':
        return <Utensils size={20} className="location-icon restaurant" />;
      case 'coffee':
        return <Coffee size={20} className="location-icon coffee" />;
      case 'park':
        return <MapPin size={20} className="location-icon park" />;
      case 'transport':
        return <Car size={20} className="location-icon transport" />;
      default:
        return <Building size={20} className="location-icon other" />;
    }
  };

  const locations = getSurroundingLocations(branchId);

  return (
    <div className={`surrounding-areas ${className}`}>
      <div className="surrounding-header">
        <h3>Khu vực xung quanh {branchName}</h3>
        <p className="surrounding-subtitle">Các địa điểm tiện ích gần cơ sở</p>
      </div>
      
      <div className="locations-grid">
        {locations.map((location, index) => (
          <div key={index} className="location-item">
            <div className="location-icon-container">
              {getIconForType(location.type)}
            </div>
            <div className="location-info">
              <h4 className="location-name">{location.name}</h4>
              <p className="location-distance">{location.distance}</p>
              {location.description && (
                <p className="location-description">{location.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurroundingAreas;
