import React, { useState, useEffect } from 'react';
import { CreateRoommatePostData } from '../types';
import { RoommateService } from '../services/roommateService';
import './CreateRoommatePostModal.css';

interface CreateRoommatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateRoommatePostModal: React.FC<CreateRoommatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<CreateRoommatePostData>({
    title: '',
    description: '',
    location: '',
    price: '',
    roomType: '',
    gender: '',
    age: '',
    contact: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleInputChange = (field: keyof CreateRoommatePostData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Tiêu đề là bắt buộc');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Mô tả là bắt buộc');
      return false;
    }
    if (!formData.contact.trim()) {
      setError('Thông tin liên hệ là bắt buộc');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await RoommateService.createPost(formData);
      
             if (response.ok) {
         setSuccess(true);
         setTimeout(() => {
           onSuccess && onSuccess();
         }, 1500);
       } else {
        setError(response.error || 'Có lỗi xảy ra khi tạo bài đăng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      price: '',
      roomType: '',
      gender: '',
      age: '',
      contact: '',
      status: 'active'
    });
    setError(null);
    setSuccess(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="modal-overlay" onClick={handleBackdropClick}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Đăng bài thành công!</h2>
            <button className="modal-close" onClick={onClose} aria-label="Đóng">
              ✕
            </button>
          </div>
          <div className="modal-body">
                         <div className="success-container">
               <div className="success-icon">✅</div>
               <h3>Bài đăng đã được tạo thành công!</h3>
               <p>Bài đăng của bạn đã được đăng lên hệ thống và sẽ hiển thị trong danh sách tìm kiếm.</p>
               <p>Trang sẽ được tải lại trong giây lát để hiển thị bài đăng mới...</p>
             </div>
          </div>
          <div className="modal-footer">
            <button className="modal-btn primary-btn" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content create-post-modal">
        <div className="modal-header">
          <h2 className="modal-title">Đăng bài tìm người ở ghép</h2>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title" className="required-field">Tiêu đề bài đăng</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ví dụ: Tìm người ở ghép phòng tại Tân Xã"
                  maxLength={100}
                />
                <div className="char-count">{formData.title.length}/100</div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description" className="required-field">Mô tả chi tiết</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về phòng, yêu cầu, lối sống mong muốn..."
                  rows={4}
                  maxLength={500}
                />
                <div className="char-count">{formData.description.length}/500</div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Địa điểm</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ví dụ: Tân Xã, Thạch Thất"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá phòng</label>
                <input
                  type="text"
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Ví dụ: 2.5 triệu/tháng"
                />
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Loại phòng</label>
                <select
                  id="roomType"
                  value={formData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                >
                  <option value="">Chọn loại phòng</option>
                  <option value="Phòng đơn">Phòng đơn</option>
                  <option value="Phòng đôi">Phòng đôi</option>
                  <option value="Phòng gác xép">Phòng gác xép</option>
                  <option value="Căn hộ mini">Căn hộ mini</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Yêu cầu giới tính</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="">Không phân biệt</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Độ tuổi mong muốn</label>
                <input
                  type="text"
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Ví dụ: 20-25 tuổi"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng thái</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                </select>
              </div>

                             <div className="form-group full-width">
                 <label htmlFor="contact" className="required-field">Thông tin liên hệ</label>
                 <input
                   type="text"
                   id="contact"
                   value={formData.contact}
                   onChange={(e) => handleInputChange('contact', e.target.value)}
                   placeholder="Ví dụ: 0123456789 hoặc email@example.com"
                 />
                 <small className="form-hint">
                   💡 Đối với số điện thoại, hãy nhập đầy đủ cả số 0 ở đầu (ví dụ: 0123456789)
                 </small>
               </div>
            </div>

            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="modal-btn secondary-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            type="button" 
            className="modal-btn secondary-btn" 
            onClick={handleReset}
            disabled={loading}
          >
            Làm mới
          </button>
          <button 
            type="submit" 
            className="modal-btn primary-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoommatePostModal;
