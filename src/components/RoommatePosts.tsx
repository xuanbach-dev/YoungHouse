import React, { useState, useEffect } from 'react';
import { RoommatePost } from '../types';
import { RoommateService } from '../services/roommateService';
import './RoommatePosts.css';

interface RoommatePostsProps {
  onPostClick?: (post: RoommatePost) => void;
}

const RoommatePosts: React.FC<RoommatePostsProps> = ({ onPostClick }) => {
  const [posts, setPosts] = useState<RoommatePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<RoommatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    roomType: '',
    gender: '',
    price: '',
    status: 'active'
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await RoommateService.getAllPosts();
      
      if (response.ok && response.data) {
        setPosts(response.data);
        setError(null);
      } else {
        setError(response.error || 'Không thể tải danh sách bài đăng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = posts;

    if (filters.location) {
      filtered = filtered.filter(post => 
        post.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.roomType) {
      filtered = filtered.filter(post => 
        post.roomType.toLowerCase().includes(filters.roomType.toLowerCase())
      );
    }

    if (filters.gender) {
      filtered = filtered.filter(post => 
        post.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.price) {
      filtered = filtered.filter(post => 
        post.price.toLowerCase().includes(filters.price.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(post => 
        post.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredPosts(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      roomType: '',
      gender: '',
      price: '',
      status: 'active'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getGenderIcon = (gender: string) => {
    if (gender.toLowerCase() === 'nam') return '👨';
    if (gender.toLowerCase() === 'nữ') return '👩';
    return '👥';
  };

  if (loading) {
    return (
      <div className="roommate-posts-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roommate-posts-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadPosts} className="retry-button">
              🔄 Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="roommate-posts-container">
      {/* Section Header */}
      <div className="roommate-section-header">
        <h2>Danh sách bài đăng</h2>
        <p>Tìm kiếm và lọc theo nhu cầu của bạn</p>
      </div>

      {/* Filters */}
      <div className="roommate-filters-section">
        <div className="roommate-filters-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
          </svg>
          Bộ lọc tìm kiếm
        </div>
        
        <div className="roommate-filters-grid">
          <div className="roommate-filter-group">
            <label>📍 Địa điểm</label>
            <input
              type="text"
              placeholder="Nhập địa điểm..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="roommate-filter-group">
            <label>🏠 Loại phòng</label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Phòng đơn">Phòng đơn</option>
              <option value="Phòng đôi">Phòng đôi</option>
              <option value="Phòng ba">Phòng ba</option>
              <option value="Phòng tư">Phòng tư</option>
            </select>
          </div>

          <div className="roommate-filter-group">
            <label>👤 Giới tính</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="roommate-filter-group">
            <label>💰 Giá</label>
            <input
              type="text"
              placeholder="VD: 2tr"
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
            />
          </div>

          <div className="roommate-filter-group">
            <label>📋 Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="active">Đang tìm</option>
              <option value="">Tất cả</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>

        <div className="roommate-filters-actions">
          <button onClick={clearFilters} className="roommate-filter-btn clear">
            ✕ Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="roommate-results-info">
        <span className="roommate-results-count">
          🔍 Tìm thấy <strong>{filteredPosts.length}</strong> bài đăng
        </span>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📭</div>
            <p>Không tìm thấy bài đăng nào phù hợp với bộ lọc của bạn.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="post-card"
              onClick={() => onPostClick && onPostClick(post)}
            >
              {/* Card Header */}
              <div className="post-card-header">
                <div className="post-avatar">
                  {getGenderIcon(post.gender)}
                </div>
                <h3 className="post-title">{post.title}</h3>
                <span className={`post-status ${post.status}`}>
                  {post.status === 'active' ? '🟢 Đang tìm' : '⚫ Đã đóng'}
                </span>
              </div>

              {/* Card Body */}
              <div className="post-card-body">
                <div className="post-info-grid">
                  <div className="post-info-item">
                    <div className="post-info-icon">📍</div>
                    <div className="post-info-content">
                      <span className="post-info-label">Địa điểm</span>
                      <span className="post-info-value">{post.location || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  
                  <div className="post-info-item">
                    <div className="post-info-icon">💰</div>
                    <div className="post-info-content">
                      <span className="post-info-label">Giá</span>
                      <span className="post-info-value">{post.price || 'Thỏa thuận'}</span>
                    </div>
                  </div>
                  
                  <div className="post-info-item">
                    <div className="post-info-icon">🏠</div>
                    <div className="post-info-content">
                      <span className="post-info-label">Loại phòng</span>
                      <span className="post-info-value">{post.roomType || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  
                  <div className="post-info-item">
                    <div className="post-info-icon">👤</div>
                    <div className="post-info-content">
                      <span className="post-info-label">Giới tính</span>
                      <span className="post-info-value">{post.gender || 'Không yêu cầu'}</span>
                    </div>
                  </div>
                </div>

                <p className="post-description">{post.description}</p>

                {/* Card Footer */}
                <div className="post-card-footer">
                  <span className="post-date">
                    🕐 {formatDate(post.createdAt)}
                  </span>
                  <button className="view-details-btn">
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoommatePosts;
