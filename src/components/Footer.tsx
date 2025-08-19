import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, MessageCircle, Youtube, Eye } from 'lucide-react';
import './Footer.css';
import { VisitCounterService } from '../services/visitCounter';

const Footer: React.FC = () => {
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    // Get current total site visits
    const visits = VisitCounterService.getTotalSiteVisits();
    setTotalVisits(visits);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <h3>YoungHouse</h3>
              <p>Hơn cả mái nhà - Đó là mái ấm</p>
            </div>
            <p className="footer-description">
              Khi nhà trọ cũng là nhà, YoungHouse tin rằng một không gian tiện nghi, 
              lối sống hiện đại là nền móng để cư dân trẻ có thể tự do sống tích cực 
              và thành công trong cuộc sống.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/younghousehoalac" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="social-link">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Liên kết nhanh</h4>
            <ul className="footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/system-home">Hệ thống nhà trọ</Link></li>
              <li><Link to="/younghouse">Về Young House</Link></li>
              <li><Link to="/profile">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Dịch vụ</h4>
            <ul className="footer-links">
              <li><a href="#">Cho thuê phòng trọ</a></li>
              <li><a href="#">Tìm kiếm phòng trọ</a></li>
             
              <li><a href="#">Hỗ trợ kỹ thuật: 083.8866.879 </a></li>
              <li><a href="#">Tư vấn hợp đồng: 096.2888.797</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Thông tin liên hệ</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} />
                <span>Số 85 đường Mục Uyên - Công Nghệ - Tân Xã - Thạch Thất - Hà Nội</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>0372858098</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>bachqxhe180125@fpt.edu.vn</span>
              </div>
            </div>
            
            <div className="newsletter">
              <h5>Đăng ký nhận tin</h5>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="newsletter-input"
                />
                <button className="newsletter-button">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 YoungHouse. Designed by Xuan Bach.</p>
            <div className="footer-bottom-links">
              <a href="#">Chính sách bảo mật</a>
              <a href="#">Điều khoản sử dụng</a>
              <a href="#">Sitemap</a>
            </div>
            <div className="visit-counter">
              <Eye size={16} />
              <span>Tổng số lượt truy cập: {totalVisits}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;