import React, { useState } from 'react';
import { CreateRoommatePostData } from '../types';
import { RoommateService } from '../services/roommateService';
import './CreateRoommatePost.css';

interface CreateRoommatePostProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateRoommatePost: React.FC<CreateRoommatePostProps> = ({ onSuccess, onCancel }) => {
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
        }, 2000);
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

  if (success) {
    return (
      <div className="create-post-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Đăng bài thành công!</h3>
          <p>Bài đăng của bạn đã được tạo và sẽ hiển thị trong danh sách.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h2>Đăng Bài Tìm Người Ở Ghép</h2>
        <p>Điền thông tin chi tiết để tìm người ở ghép phù hợp</p>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="form-grid">
          {/* Tiêu đề */}
          <div className="form-group full-width">
            <label htmlFor="title">Tiêu đề bài đăng *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="VD: Tìm bạn nữ ở ghép phòng tại Tân Xã"
              required
            />
          </div>

          {/* Mô tả */}
          <div className="form-group full-width">
            <label htmlFor="description">Mô tả chi tiết *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả về phòng, tiện nghi, yêu cầu về người ở ghép..."
              rows={4}
              required
            />
          </div>

          {/* Địa điểm */}
          <div className="form-group">
            <label htmlFor="location">Địa điểm</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="VD: Tân Xã, Thạch Thất, Hà Nội"
            />
          </div>

          {/* Giá */}
          <div className="form-group">
            <label htmlFor="price">Giá phòng</label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="VD: 2tr/người/tháng"
            />
          </div>

          {/* Loại phòng */}
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
              <option value="Phòng ba">Phòng ba</option>
              <option value="Phòng tư">Phòng tư</option>
            </select>
          </div>

          {/* Giới tính */}
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

          {/* Độ tuổi */}
          <div className="form-group">
            <label htmlFor="age">Độ tuổi mong muốn</label>
            <input
              type="text"
              id="age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="VD: 20-25 tuổi"
            />
          </div>

          {/* Thông tin liên hệ */}
          <div className="form-group full-width">
            <label htmlFor="contact">Thông tin liên hệ *</label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Số điện thoại hoặc email"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="reset-btn"
            disabled={loading}
          >
            Làm mới
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={loading}
          >
            Hủy
          </button>
          
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang đăng bài...' : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoommatePost;
