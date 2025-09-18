import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const zaloPhone = '0372858098';
  const zaloUrl = `https://zalo.me/${zaloPhone}`;
  const facebookUrl = 'https://www.facebook.com/'; // cập nhật link fanpage nếu có

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Về chúng tôi</h1>
        <p className="subtitle">Hỗ trợ 24/7 – Nhắn tin Zalo hoặc Facebook để được tư vấn nhanh</p>

        <section className="about-younghouse" aria-label="Giới thiệu YoungHouse Hoà Lạc" style={{marginTop: '1rem'}}>
          <h2>Hệ thống nhà trọ YoungHouse tại Hoà Lạc</h2>
          <p>
            YoungHouse Hoà Lạc là hệ thống nhà cho thuê dành cho sinh viên, người đi làm tại khu vực Hoà Lạc và lân cận. Chúng tôi 
            tập trung xây dựng các tòa nhà sáng, thoáng, kết cấu chắc chắn, cùng không gian sinh hoạt sạch sẽ, an ninh và tiện nghi. 
            Mỗi phòng đều được trang bị đầy đủ nội thất cơ bản như giường tủ, bàn học, điều hòa, bình nóng lạnh, tủ bếp, cùng hệ thống 
            internet tốc độ cao. Các tòa nhà được quản lý chuyên nghiệp, hỗ trợ 24/7, đảm bảo trải nghiệm ở ổn định, thân thiện và tiết kiệm cho cư dân.
          </p>
          <p>
            Vị trí các cơ sở YoungHouse phân bố tại Tân Xã, Phú Hữu, Bình Yên… thuận tiện di chuyển tới Đại học FPT, khu Công nghệ cao Hoà Lạc 
            và các tiện ích công cộng. Nhiều loại phòng linh hoạt: phòng đơn, phòng đôi, phòng gác xép, phòng có ban công hoặc hành lang thoáng, 
            phù hợp nhu cầu cá nhân và nhóm bạn. Hệ thống an ninh sử dụng khóa vân tay, camera giám sát toàn tòa, quy trình vệ sinh định kỳ; khu để xe 
            rộng rãi; máy giặt chung; thang máy tại các tòa cao tầng; hành lang cây xanh và không gian sinh hoạt chung.
          </p>
          <p>
            Website younghousehoalac.com giúp bạn tìm phòng nhanh qua bộ lọc khu vực, mức giá, tình trạng phòng, đồng thời cung cấp hình ảnh, video, 
            bản đồ vị trí từng cơ sở để bạn dễ dàng hình dung trước khi đặt lịch xem. Nếu bạn cần hỗ trợ, đội ngũ tư vấn luôn sẵn sàng qua điện thoại 
            và Zalo. Hãy khám phá hệ thống nhà trọ YoungHouse, nơi mang đến không gian sống tiện nghi, an toàn và cộng đồng thân thiện tại Hoà Lạc.
          </p>
        </section>

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
