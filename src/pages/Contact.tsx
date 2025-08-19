import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const zaloPhone = '0372858098';
  const zaloUrl = `https://zalo.me/${zaloPhone}`;
  const facebookUrl = 'https://www.facebook.com/'; // cập nhật link fanpage nếu có

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Liên hệ Young House</h1>
        <p className="subtitle">Hỗ trợ 24/7 – Nhắn tin Zalo hoặc Facebook để được tư vấn nhanh</p>

        <div className="contact-grid">
          <div className="map-card">
            <div className="map-wrapper">
              <iframe
                title="Young House Map"
                className="map-frame"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.999192714614!2d105.525!3d21.013366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455c0b2b0b0b0%3A0x0!2zSOG7jWMgVMOibiBYw6E!5e0!3m2!1svi!2svi!4v${Date.now()}`}
              />
            </div>
            <div className="map-note">Khu vực Tân Xã – Phú Hữu – Bình Yên, Hòa Lạc (gần Đại học FPT)</div>
          </div>

          <div className="contact-card">
            <h2>Kênh liên hệ</h2>
            <div className="contact-actions">
              <a className="contact-btn zalo" href={zaloUrl} target="_blank" rel="noreferrer">
                <img src="/Zalo.png" alt="Zalo" className="contact-icon" />
                 Zalo: {zaloPhone}
              </a>
              <a className="contact-btn facebook" href="https://www.facebook.com/profile.php?id=100043274418628" target="_blank" rel="noreferrer">
                <img src="/messenger-icon.png" alt="Facebook" className="contact-icon" />
                Young House
              </a>
            </div>
            <div className="contact-info">
              <p>Email: bachqxhe180125@fpt.edu.vn</p>
              <p>Thời gian hỗ trợ: 24/7 (T2–CN)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
