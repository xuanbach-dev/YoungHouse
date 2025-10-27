import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, CheckCircle } from 'lucide-react';
import { viewingAppointmentsAPI, roomsAPI } from '../services/api';
import { emailService } from '../services/emailService';
import { ViewingAppointment, Room } from '../types';
import './ViewingAppointmentForm.css';

interface ViewingAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: number;
  room?: Room;
}

const ViewingAppointmentForm: React.FC<ViewingAppointmentFormProps> = ({
  isOpen,
  onClose,
  roomId,
  room
}) => {
  const [formData, setFormData] = useState<Partial<ViewingAppointment>>({
    fullName: '',
    email: '',
    phone: '',
    viewingDate: '',
    viewingTime: '',
    roomId: roomId || 0,
    note: ''
  });
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Time slots available for booking (9 AM to 6 PM)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        roomId: roomId || 0
      }));
      setIsSubmitted(false);
      setError(null);
      setValidationErrors({});
    }
  }, [isOpen, roomId]);

  useEffect(() => {
    if (formData.viewingDate && formData.roomId) {
      fetchAvailableSlots();
    }
  }, [formData.viewingDate, formData.roomId]);

  const fetchAvailableSlots = async () => {
    if (!formData.viewingDate || !formData.roomId) return;
    
    try {
      const response = await viewingAppointmentsAPI.getAvailableSlots(
        formData.roomId, 
        formData.viewingDate
      );
      // Update to handle mock API response structure
      setAvailableSlots(response.data?.availableSlots || timeSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(timeSlots); // Fallback to all slots
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.fullName?.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Định dạng email không hợp lệ';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)';
    }

    if (!formData.viewingDate) {
      errors.viewingDate = 'Vui lòng chọn ngày xem phòng';
    } else {
      const selectedDate = new Date(formData.viewingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.viewingDate = 'Ngày xem phòng phải sau ngày hôm nay';
      }
    }

    if (!formData.viewingTime) {
      errors.viewingTime = 'Vui lòng chọn giờ xem phòng';
    }

    if (!formData.roomId) {
      errors.roomId = 'Vui lòng chọn phòng';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ViewingAppointment, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the viewing appointment
      const appointmentResponse = await viewingAppointmentsAPI.create(formData);
      
      // Send confirmation email
      if (formData.email && room) {
        try {
          await emailService.sendAppointmentConfirmation({
            fullName: formData.fullName || '',
            email: formData.email,
            phone: formData.phone || '',
            viewingDate: formData.viewingDate || '',
            viewingTime: formData.viewingTime || '',
            roomNumber: (room.RoomID || room.roomId || '').toString(),
            roomType: room.typeName || 'Phòng Trọ',
            note: formData.note
          });

          // Send admin notification email
          await emailService.sendAdminAppointmentNotification({
            fullName: formData.fullName || '',
            email: formData.email,
            phone: formData.phone || '',
            viewingDate: formData.viewingDate || '',
            viewingTime: formData.viewingTime || '',
            roomNumber: (room.RoomID || room.roomId || '').toString(),
            roomType: room.typeName || 'Phòng Trọ',
            note: formData.note
          });
        } catch (emailError) {
          // Log the email error but don't prevent appointment creation
          console.error('Email sending failed:', emailError);
          
          // Set a user-friendly error message
          setError(
            emailError instanceof Error && emailError.message.includes('email') 
              ? 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.' 
              : 'Đã có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.'
          );
        }
      }

      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          viewingDate: '',
          viewingTime: '',
          roomId: roomId || 0,
          note: ''
        });
      }, 2000);
    } catch (error: any) {
      // Handle appointment creation error
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch hẹn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        viewingDate: '',
        viewingTime: '',
        roomId: roomId || 0,
        note: ''
      });
      setValidationErrors({});
      setError(null);
      setIsSubmitted(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay">
      <div className="appointment-modal">
        <div className="appointment-header">
          <div className="appointment-header-content">
            <div className="appointment-icon">
              <Calendar size={24} />
            </div>
            <div>
              <h2>Đặt lịch xem phòng</h2>
              {room && (
                <p className="room-info">
                  <MapPin size={16} />
                  {room.BranchName} - {room.typeName}
                </p>
              )}
            </div>
          </div>
          <button 
            className="close-button" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <CheckCircle size={48} className="success-icon" />
            <h3>Đặt lịch thành công!</h3>
            <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận lịch hẹn.</p>
            <div className="appointment-details">
              <p><strong>Ngày:</strong> {formData.viewingDate}</p>
              <p><strong>Giờ:</strong> {formData.viewingTime}</p>
              <p><strong>Phòng:</strong> {room?.BranchName}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="fullName">
                Họ và tên <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên"
                className={validationErrors.fullName ? 'error' : ''}
              />
              {validationErrors.fullName && (
                <span className="error-message">{validationErrors.fullName}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Nhập email"
                  className={validationErrors.email ? 'error' : ''}
                />
                {validationErrors.email && (
                  <span className="error-message">{validationErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={validationErrors.phone ? 'error' : ''}
                />
                {validationErrors.phone && (
                  <span className="error-message">{validationErrors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="viewingDate">
                  Ngày xem phòng <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="viewingDate"
                  value={formData.viewingDate || ''}
                  onChange={(e) => handleInputChange('viewingDate', e.target.value)}
                  min={getMinDate()}
                  className={validationErrors.viewingDate ? 'error' : ''}
                />
                {validationErrors.viewingDate && (
                  <span className="error-message">{validationErrors.viewingDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="viewingTime">
                  Giờ xem phòng <span className="required">*</span>
                </label>
                <select
                  id="viewingTime"
                  value={formData.viewingTime || ''}
                  onChange={(e) => handleInputChange('viewingTime', e.target.value)}
                  className={validationErrors.viewingTime ? 'error' : ''}
                  disabled={!formData.viewingDate}
                >
                  <option value="">Chọn giờ</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {validationErrors.viewingTime && (
                  <span className="error-message">{validationErrors.viewingTime}</span>
                )}
                {formData.viewingDate && availableSlots.length === 0 && (
                  <span className="info-message">Không có khung giờ trống trong ngày này</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="note">
                Ghi chú thêm (không bắt buộc)
              </label>
              <textarea
                id="note"
                value={formData.note || ''}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Ghi chú một số thông tin cụ thể như yêu cầu đặc biệt..."
                rows={3}
              />
            </div>

            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            
           

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ViewingAppointmentForm;