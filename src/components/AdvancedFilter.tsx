import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  Wifi,
  Wind,
  Car,
  Tv,
  Refrigerator,
  WashingMachine,
  MapPin,
  Home,
  DollarSign,
  Ruler,
  Filter,
  RotateCcw
} from 'lucide-react';
import './AdvancedFilter.css';

export interface FilterState {
  areas: string[];
  branches: number[];
  priceRange: { min: number; max: number };
  roomSizes: string[];
  amenities: string[];
  distanceToFPT: string;
  status: string;
}

interface AdvancedFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  totalResults
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    area: true,
    price: true,
    size: false,
    amenities: false,
    distance: false,
    status: true
  });

  // Available options
  const availableAreas = [
    { name: 'Tân Xã', branchIds: [1, 4, 5, 7, 8], description: 'Gần FPT 2-3km' },
    { name: 'Phú Hữu', branchIds: [2, 11, 12, 14], description: 'Gần FPT 2-3km' },
    { name: 'Bình Yên', branchIds: [6, 9, 10], description: 'Gần FPT 3-4km' }
  ];

  const pricePresets = [
    { label: 'Dưới 1.5tr', min: 0, max: 1500000 },
    { label: '1.5tr - 2tr', min: 1500000, max: 2000000 },
    { label: '2tr - 2.5tr', min: 2000000, max: 2500000 },
    { label: '2.5tr - 3tr', min: 2500000, max: 3000000 },
    { label: 'Trên 3tr', min: 3000000, max: 10000000 }
  ];

  const roomSizeOptions = [
    { label: '16-20m²', value: '16-20' },
    { label: '20-25m²', value: '20-25' },
    { label: '25-30m²', value: '25-30' },
    { label: '30-40m²', value: '30-40' }
  ];

  const amenityOptions = [
    { id: 'wifi', label: 'Wifi miễn phí', icon: Wifi },
    { id: 'ac', label: 'Điều hòa', icon: Wind },
    { id: 'parking', label: 'Chỗ để xe', icon: Car },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'fridge', label: 'Tủ lạnh', icon: Refrigerator },
    { id: 'washing', label: 'Máy giặt', icon: WashingMachine }
  ];

  const distanceOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới 2km', value: '2' },
    { label: 'Dưới 3km', value: '3' },
    { label: 'Dưới 5km', value: '5' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAreaChange = (areaName: string) => {
    const newAreas = filters.areas.includes(areaName)
      ? filters.areas.filter(a => a !== areaName)
      : [...filters.areas, areaName];
    onFilterChange({ ...filters, areas: newAreas });
  };

  const handlePricePreset = (min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: { min, max } });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    onFilterChange({
      ...filters,
      priceRange: { ...filters.priceRange, [type]: value }
    });
  };

  const handleRoomSizeChange = (size: string) => {
    const newSizes = filters.roomSizes.includes(size)
      ? filters.roomSizes.filter(s => s !== size)
      : [...filters.roomSizes, size];
    onFilterChange({ ...filters, roomSizes: newSizes });
  };

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  const handleDistanceChange = (distance: string) => {
    onFilterChange({ ...filters, distanceToFPT: distance });
  };

  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.areas.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000000) count++;
    if (filters.roomSizes.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.distanceToFPT !== 'all') count++;
    if (filters.status !== 'All') count++;
    return count;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}tr`;
    }
    return `${(price / 1000).toFixed(0)}k`;
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="advanced-filter-overlay" onClick={onClose}>
      <div className="advanced-filter-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="filter-panel-header">
          <div className="filter-header-left">
            <Filter size={20} />
            <h2>Bộ lọc nâng cao</h2>
            {getActiveFilterCount() > 0 && (
              <span className="filter-count">{getActiveFilterCount()}</span>
            )}
          </div>
          <button className="filter-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="filter-panel-content">
          {/* Area Section */}
          <div className="filter-section-advanced">
            <button 
              className="section-header" 
              onClick={() => toggleSection('area')}
            >
              <div className="section-title">
                <MapPin size={18} />
                <span>Khu vực</span>
                {filters.areas.length > 0 && (
                  <span className="section-badge">{filters.areas.length}</span>
                )}
              </div>
              {expandedSections.area ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.area && (
              <div className="section-content">
                <div className="area-grid">
                  {availableAreas.map(area => (
                    <label 
                      key={area.name} 
                      className={`area-card ${filters.areas.includes(area.name) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.areas.includes(area.name)}
                        onChange={() => handleAreaChange(area.name)}
                      />
                      <div className="area-info">
                        <span className="area-name">{area.name}</span>
                        <span className="area-desc">{area.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="filter-section-advanced">
            <button 
              className="section-header" 
              onClick={() => toggleSection('price')}
            >
              <div className="section-title">
                <DollarSign size={18} />
                <span>Khoảng giá</span>
                {(filters.priceRange.min > 0 || filters.priceRange.max < 10000000) && (
                  <span className="section-value">
                    {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
                  </span>
                )}
              </div>
              {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.price && (
              <div className="section-content">
                <div className="price-presets">
                  {pricePresets.map(preset => (
                    <button
                      key={preset.label}
                      className={`preset-btn ${
                        filters.priceRange.min === preset.min && 
                        filters.priceRange.max === preset.max ? 'active' : ''
                      }`}
                      onClick={() => handlePricePreset(preset.min, preset.max)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                
                <div className="price-sliders">
                  <div className="price-input-group">
                    <label>Từ</label>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                    />
                    <span className="price-value">{formatPrice(filters.priceRange.min)}</span>
                  </div>
                  <div className="price-input-group">
                    <label>Đến</label>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                    />
                    <span className="price-value">{formatPrice(filters.priceRange.max)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Room Size Section */}
          <div className="filter-section-advanced">
            <button 
              className="section-header" 
              onClick={() => toggleSection('size')}
            >
              <div className="section-title">
                <Ruler size={18} />
                <span>Diện tích phòng</span>
                {filters.roomSizes.length > 0 && (
                  <span className="section-badge">{filters.roomSizes.length}</span>
                )}
              </div>
              {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.size && (
              <div className="section-content">
                <div className="size-options">
                  {roomSizeOptions.map(size => (
                    <label 
                      key={size.value}
                      className={`size-chip ${filters.roomSizes.includes(size.value) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.roomSizes.includes(size.value)}
                        onChange={() => handleRoomSizeChange(size.value)}
                      />
                      {size.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amenities Section */}
          <div className="filter-section-advanced">
            <button 
              className="section-header" 
              onClick={() => toggleSection('amenities')}
            >
              <div className="section-title">
                <Home size={18} />
                <span>Tiện ích</span>
                {filters.amenities.length > 0 && (
                  <span className="section-badge">{filters.amenities.length}</span>
                )}
              </div>
              {expandedSections.amenities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.amenities && (
              <div className="section-content">
                <div className="amenities-grid">
                  {amenityOptions.map(amenity => {
                    const Icon = amenity.icon;
                    return (
                      <label 
                        key={amenity.id}
                        className={`amenity-chip ${filters.amenities.includes(amenity.id) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityChange(amenity.id)}
                        />
                        <Icon size={16} />
                        <span>{amenity.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Distance to FPT Section */}
          <div className="filter-section-advanced">
            <button 
              className="section-header" 
              onClick={() => toggleSection('distance')}
            >
              <div className="section-title">
                <MapPin size={18} />
                <span>Khoảng cách tới FPT</span>
                {filters.distanceToFPT !== 'all' && (
                  <span className="section-value">
                    Dưới {filters.distanceToFPT}km
                  </span>
                )}
              </div>
              {expandedSections.distance ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.distance && (
              <div className="section-content">
                <div className="distance-options">
                  {distanceOptions.map(option => (
                    <label 
                      key={option.value}
                      className={`distance-radio ${filters.distanceToFPT === option.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="distance"
                        checked={filters.distanceToFPT === option.value}
                        onChange={() => handleDistanceChange(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="filter-section-advanced">
            <button 
              className="section-header" 
              onClick={() => toggleSection('status')}
            >
              <div className="section-title">
                <Home size={18} />
                <span>Trạng thái phòng</span>
              </div>
              {expandedSections.status ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {expandedSections.status && (
              <div className="section-content">
                <div className="status-options">
                  <label className={`status-radio ${filters.status === 'All' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === 'All'}
                      onChange={() => handleStatusChange('All')}
                    />
                    <span className="status-dot all"></span>
                    Tất cả phòng
                  </label>
                  <label className={`status-radio ${filters.status === 'Available' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === 'Available'}
                      onChange={() => handleStatusChange('Available')}
                    />
                    <span className="status-dot available"></span>
                    Còn phòng trống
                  </label>
                  <label className={`status-radio ${filters.status === 'Reserved' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === 'Reserved'}
                      onChange={() => handleStatusChange('Reserved')}
                    />
                    <span className="status-dot reserved"></span>
                    Đã đặt trước
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="filter-panel-footer">
          <button className="clear-all-btn" onClick={onClearFilters}>
            <RotateCcw size={16} />
            Xóa bộ lọc
          </button>
          <button className="apply-btn" onClick={onClose}>
            Xem {totalResults} kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
