import React, { useState, useEffect } from 'react';
import RoommatePosts from '../components/RoommatePosts';
import CreateRoommatePostModal from '../components/CreateRoommatePostModal';
import RoommatePostModal from '../components/RoommatePostModal';
import { RoommatePost } from '../types';
import { RoommateService } from '../services/roommateService';
import './RoommateFinder.css';

const RoommateFinder: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<RoommatePost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activePosts, setActivePosts] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await RoommateService.getAllPosts();
      if (response.ok && response.data) {
        setTotalPosts(response.data.length);
        setActivePosts(response.data.filter(p => p.status === 'active').length);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

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
    loadStats();
    window.location.reload();
  };

  const scrollToPosts = () => {
    const postsSection = document.getElementById('posts-section');
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="roommate-finder-page">
      {/* Hero Section */}
      <section className="roommate-hero">
        <div className="hero-content">
          <h1>Tìm Người Ở Ghép</h1>
          <p>Kết nối với những người có nhu cầu ở ghép phòng phù hợp. Đăng tin miễn phí, tìm bạn cùng phòng lý tưởng chỉ trong vài bước đơn giản.</p>
          
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => setIsCreateModalOpen(true)}>
              <span className="btn-icon">✏️</span>
              Đăng Tin Ngay
            </button>
            <button className="hero-btn secondary" onClick={scrollToPosts}>
              <span className="btn-icon">🔍</span>
              Xem Danh Sách
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{totalPosts}</span>
          <span className="stat-label">Tổng bài đăng</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{activePosts}</span>
          <span className="stat-label">Đang tìm người</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Hỗ trợ</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">Miễn phí</span>
        </div>
      </div>

      {/* Posts Section */}
      <div className="page-content" id="posts-section">
        <RoommatePosts onPostClick={handlePostClick} />
      </div>

      {/* How It Works Section */}
      <section className="features-section">
        <h2>Quy trình tìm người ở ghép</h2>
        <p className="section-subtitle">Chỉ 4 bước đơn giản để tìm được bạn cùng phòng phù hợp</p>
        
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
            <p>Liên hệ trực tiếp với người đăng bài để trao đổi thêm thông tin chi tiết.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>4. Thỏa Thuận</h3>
            <p>Gặp mặt, tham quan phòng và thỏa thuận các điều khoản để hoàn tất.</p>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h4>Mẹo đăng bài hiệu quả</h4>
              <p>Viết mô tả chi tiết, rõ ràng về yêu cầu và điều kiện phòng để thu hút người phù hợp.</p>
            </div>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🛡️</div>
            <div className="tip-content">
              <h4>An toàn khi giao dịch</h4>
              <p>Luôn gặp mặt trực tiếp và xem phòng trước khi đặt cọc hoặc ký hợp đồng.</p>
            </div>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">📞</div>
            <div className="tip-content">
              <h4>Liên hệ nhanh chóng</h4>
              <p>Phản hồi tin nhắn sớm để tăng cơ hội tìm được người ở ghép phù hợp.</p>
            </div>
          </div>
        </div>
      </section>

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
