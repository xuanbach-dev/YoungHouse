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
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="roommate-posts-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roommate-posts-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadPosts} className="retry-button">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="roommate-posts-container">
      <div className="roommate-posts-header">
        <h2>Tìm Người Ở Ghép</h2>
        <p>Khám phá các cơ hội ở ghép phòng phù hợp với bạn</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Địa điểm:</label>
            <input
              type="text"
              placeholder="Nhập địa điểm..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Loại phòng:</label>
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

          <div className="filter-group">
            <label>Giới tính:</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Không phân biệt">Không phân biệt</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Giá:</label>
            <input
              type="text"
              placeholder="Nhập giá..."
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="">Tất cả</option>
            </select>
          </div>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Xóa bộ lọc
        </button>
      </div>

      {/* Results count */}
      <div className="results-info">
        <p>Tìm thấy {filteredPosts.length} bài đăng</p>
      </div>

      {/* Posts list */}
      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>Không tìm thấy bài đăng nào phù hợp với bộ lọc của bạn.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="post-card"
              onClick={() => onPostClick && onPostClick(post)}
            >
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <span className={`post-status ${post.status}`}>
                  {post.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </span>
              </div>

              <div className="post-details">
                <div className="detail-row">
                  <span className="detail-label">📍 Địa điểm:</span>
                  <span className="detail-value">{post.location || 'Chưa cập nhật'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">💰 Giá:</span>
                  <span className="detail-value">{post.price || 'Thỏa thuận'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">🏠 Loại phòng:</span>
                  <span className="detail-value">{post.roomType || 'Chưa cập nhật'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">👤 Giới tính:</span>
                  <span className="detail-value">{post.gender || 'Không phân biệt'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">📅 Độ tuổi:</span>
                  <span className="detail-value">{post.age || 'Không yêu cầu'}</span>
                </div>
              </div>

              <p className="post-description">{post.description}</p>

              <div className="post-footer">
                <span className="post-date">
                  Đăng ngày: {formatDate(post.createdAt)}
                </span>
                <button className="view-details-btn">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoommatePosts;
