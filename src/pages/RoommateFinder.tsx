import React, { useState } from 'react';
import RoommatePosts from '../components/RoommatePosts';
import CreateRoommatePostModal from '../components/CreateRoommatePostModal';
import RoommatePostModal from '../components/RoommatePostModal';
import { RoommatePost } from '../types';
import './RoommateFinder.css';

const RoommateFinder: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<RoommatePost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePostClick = (post: RoommatePost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Refresh trang để hiển thị bài đăng mới
    window.location.reload();
  };

  return (
    <div className="roommate-finder-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Tìm Người Ở Ghép</h1>
          <p>Kết nối với những người có nhu cầu ở ghép phòng phù hợp. Tìm kiếm và đăng bài miễn phí để tìm được người ở ghép lý tưởng.</p>
        </div>
        
        <div className="header-actions">
          <button
            className="view-btn active"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <span className="btn-icon">📋</span>
            Xem Danh Sách
          </button>
          
          <button
            className="create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="btn-icon">✏️</span>
            Đăng Bài Mới
          </button>
        </div>
      </div>

      <div className="page-content">
        <RoommatePosts onPostClick={handlePostClick} />
      </div>

     

    
      {/* How It Works Section */}
      <div className="features-section" style={{ marginTop: '2rem' }}>
        <h2>Quy trình tìm người ở ghép</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>1. Đăng Bài</h3>
            <p>Đăng thông tin chi tiết về phòng hoặc nhu cầu tìm phòng với các tiêu chí cụ thể.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>2. Tìm Kiếm</h3>
            <p>Sử dụng bộ lọc thông minh để tìm kiếm bài đăng phù hợp với nhu cầu của bạn.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>3. Liên Hệ</h3>
            <p>Liên hệ trực tiếp với người đăng bài để trao đổi thêm thông tin và sắp xếp gặp mặt.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>4. Thỏa Thuận</h3>
            <p>Gặp mặt, tham quan và thỏa thuận các điều khoản để hoàn tất việc ở ghép.</p>
          </div>
        </div>
      </div>

      {/* Modal for post details */}
      <RoommatePostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Modal for creating new post */}
      <CreateRoommatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default RoommateFinder;
