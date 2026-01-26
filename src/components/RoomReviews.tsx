import React, { useState, useEffect } from 'react';
import { ReviewService, RoomReview, CreateReviewData } from '../services/reviewService';
import './RoomReviews.css';

interface RoomReviewsProps {
  roomId: number;
  roomName?: string;
}

const RoomReviews: React.FC<RoomReviewsProps> = ({ roomId, roomName }) => {
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Rating stats
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateReviewData>({
    roomId: roomId,
    reviewerName: '',
    rating: 5,
    comment: '',
    pros: '',
    cons: '',
    stayDuration: ''
  });

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [roomId]);

  const loadReviews = async () => {
    setLoading(true);
    const response = await ReviewService.getReviewsByRoomId(roomId);
    if (response.ok && response.data) {
      setReviews(response.data);
      setError(null);
    } else {
      setError(response.error || 'Không thể tải đánh giá');
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const response = await ReviewService.getRoomRatingStats(roomId);
    if (response.ok && response.data) {
      setStats(response.data);
    }
  };

  const handleInputChange = (field: keyof CreateReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reviewerName.trim() || !formData.comment.trim()) {
      setError('Vui lòng nhập tên và nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await ReviewService.createReview({
      ...formData,
      roomId: roomId
    });

    if (response.ok) {
      setSubmitSuccess(true);
      setFormData({
        roomId: roomId,
        reviewerName: '',
        rating: 5,
        comment: '',
        pros: '',
        cons: '',
        stayDuration: ''
      });
      await loadReviews();
      await loadStats();
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 2000);
    } else {
      setError(response.error || 'Không thể gửi đánh giá');
    }

    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className={`stars-container ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="rating-bar-row" key={rating}>
        <span className="rating-label">{rating} ★</span>
        <div className="rating-bar">
          <div className="rating-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="rating-count">{count}</span>
      </div>
    );
  };

  return (
    <div className="room-reviews">
      <div className="reviews-header">
        <h2>Đánh giá từ khách thuê</h2>
        {roomName && <p className="room-name">{roomName}</p>}
      </div>

      {/* Rating Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="rating-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">{stats.averageRating}</span>
              <div className="rating-details">
                {renderStars(Math.round(stats.averageRating))}
                <span className="total-reviews">{stats.totalReviews} đánh giá</span>
              </div>
            </div>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => 
              renderRatingBar(rating, stats.ratingDistribution[rating] || 0, stats.totalReviews)
            )}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {!showForm && (
        <button className="write-review-btn" onClick={() => setShowForm(true)}>
          ✍️ Viết đánh giá
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="review-form-container">
          <div className="form-header">
            <h3>Viết đánh giá của bạn</h3>
            <button className="close-form-btn" onClick={() => setShowForm(false)}>×</button>
          </div>

          {submitSuccess ? (
            <div className="submit-success">
              <span className="success-icon">✅</span>
              <p>Cảm ơn bạn đã đánh giá!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label>Đánh giá của bạn *</label>
                <div className="rating-input">
                  {renderStars(formData.rating, true, (r) => handleInputChange('rating', r))}
                  <span className="rating-text">
                    {formData.rating === 5 && 'Tuyệt vời'}
                    {formData.rating === 4 && 'Tốt'}
                    {formData.rating === 3 && 'Bình thường'}
                    {formData.rating === 2 && 'Không hài lòng'}
                    {formData.rating === 1 && 'Rất tệ'}
                  </span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reviewerName">Tên của bạn *</label>
                  <input
                    type="text"
                    id="reviewerName"
                    value={formData.reviewerName}
                    onChange={(e) => handleInputChange('reviewerName', e.target.value)}
                    placeholder="Nhập tên hiển thị"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stayDuration">Thời gian ở</label>
                  <select
                    id="stayDuration"
                    value={formData.stayDuration}
                    onChange={(e) => handleInputChange('stayDuration', e.target.value)}
                  >
                    <option value="">Chọn thời gian</option>
                    <option value="Dưới 3 tháng">Dưới 3 tháng</option>
                    <option value="3-6 tháng">3-6 tháng</option>
                    <option value="6-12 tháng">6-12 tháng</option>
                    <option value="Trên 1 năm">Trên 1 năm</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Nhận xét của bạn *</label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pros">👍 Điểm tốt</label>
                  <textarea
                    id="pros"
                    value={formData.pros}
                    onChange={(e) => handleInputChange('pros', e.target.value)}
                    placeholder="VD: Phòng sạch sẽ, chủ nhà thân thiện..."
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cons">👎 Điểm cần cải thiện</label>
                  <textarea
                    id="cons"
                    value={formData.cons}
                    onChange={(e) => handleInputChange('cons', e.target.value)}
                    placeholder="VD: Wifi chậm, nóng về mùa hè..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="reviews-loading">
            <div className="spinner"></div>
            <p>Đang tải đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <span className="no-reviews-icon">💬</span>
            <p>Chưa có đánh giá nào cho phòng này.</p>
            <p className="sub-text">Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <span className="reviewer-name">
                      {review.reviewerName}
                      {review.isVerified && <span className="verified-badge">✓ Đã xác minh</span>}
                    </span>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.stayDuration && (
                <div className="stay-duration">
                  🏠 Đã ở: {review.stayDuration}
                </div>
              )}

              <p className="review-comment">{review.comment}</p>

              {(review.pros || review.cons) && (
                <div className="review-pros-cons">
                  {review.pros && (
                    <div className="pros">
                      <span className="label">👍 Điểm tốt:</span>
                      <span className="content">{review.pros}</span>
                    </div>
                  )}
                  {review.cons && (
                    <div className="cons">
                      <span className="label">👎 Cần cải thiện:</span>
                      <span className="content">{review.cons}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomReviews;
