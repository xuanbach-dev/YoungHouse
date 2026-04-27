import React from 'react';
import './Contact.css';
import Meta from '../components/Meta';

const Contact: React.FC = () => {
  const zaloPhone = '0372858098';
  const zaloUrl = `https://zalo.me/${zaloPhone}`;
  const facebookUrl = 'https://www.facebook.com/'; // cập nhật link fanpage nếu có

  return (
    <div className="contact-page">
      <div className="container">
        <Meta
          title="Liên hệ | YoungHouse Hoà Lạc"
          description="Liên hệ YoungHouse Hoà Lạc để được tư vấn phòng trọ và đặt lịch xem phòng nhanh chóng."
          url="https://younghousehoalac.com/contact"
          image="/logo.png"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Liên hệ YoungHouse Hoà Lạc',
            url: 'https://younghousehoalac.com/contact'
          }}
        />

        <h1>Liên hệ</h1>
        <p className="subtitle">Hỗ trợ 24/7 – Nhắn tin Zalo hoặc Facebook để được tư vấn nhanh</p>

        <div className="contact-grid">
          <div className="map-card">
            <div className="map-wrapper">
              <iframe
                title="Young House Map"
                className="map-frame"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3812917275845!2d105.54630277471405!3d21.01742428816887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b41e87c01f3%3A0xd0059f09a8791280!2zTmjDoCBUcuG7jSBZb3VuZyBIb3VzZSA0!5e0!3m2!1svi!2s!4v1759681081102!5m2!1svi!2s${Date.now()}`}
              />
            </div>
            <div className="map-note">VP Young House Hoà Lạc : 85 Mục Uyên-Tân Xã(Young House 4)</div>
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
