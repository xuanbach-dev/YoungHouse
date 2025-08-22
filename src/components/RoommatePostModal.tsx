import React, { useEffect } from 'react';
import { RoommatePost } from '../types';
import './RoommatePostModal.css';

interface RoommatePostModalProps {
  post: RoommatePost | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoommatePostModal: React.FC<RoommatePostModalProps> = ({ post, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  // Ensure contact is a string for safety
  const contactInfo = typeof post.contact === 'string' ? post.contact : String(post.contact || '');
  const isEmail = contactInfo.includes('@');
  const isPhone = contactInfo && !isEmail;



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContactClick = () => {
    // Có thể mở app gọi điện hoặc copy số điện thoại
    if (contactInfo) {
      if (isEmail) {
        window.open(`mailto:${contactInfo}`);
      } else if (isPhone) {
        window.open(`tel:${contactInfo}`);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{post.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="post-status-badge">
            <span className={`status-indicator ${post.status}`}>
              {post.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>

          <div className="post-description">
            <h3>Mô tả</h3>
            <p>{post.description}</p>
          </div>

          <div className="post-details">
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">📍 Địa điểm</span>
                <span className="detail-value">{post.location || 'Chưa cập nhật'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">💰 Giá phòng</span>
                <span className="detail-value highlight">{post.price || 'Thỏa thuận'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">🏠 Loại phòng</span>
                <span className="detail-value">{post.roomType || 'Chưa cập nhật'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">👤 Yêu cầu giới tính</span>
                <span className="detail-value">{post.gender || 'Không phân biệt'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">📅 Độ tuổi mong muốn</span>
                <span className="detail-value">{post.age || 'Không yêu cầu'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">📅 Ngày đăng</span>
                <span className="detail-value">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

                    <div className="post-contact">
            <div className="contact-header">
              <span className="contact-icon">📞</span>
              <h3 className="contact-title">Thông tin liên hệ</h3>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-item-icon">
                  {isEmail ? '📧' : '📞'}
                </span>
                <span className="contact-item-text">
                  {contactInfo ? (
                    isEmail ? (
                      <a href={`mailto:${contactInfo}`}>{contactInfo}</a>
                    ) : (
                      <a href={`tel:${contactInfo}`}>{contactInfo}</a>
                    )
                  ) : (
                    <span>Chưa có thông tin liên hệ</span>
                  )}
                </span>
              </div>
              
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn secondary-btn" onClick={onClose}>
            Đóng
          </button>
          <button className="modal-btn primary-btn" onClick={handleContactClick}>
            Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoommatePostModal;
