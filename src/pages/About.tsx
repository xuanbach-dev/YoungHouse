import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, MapPin, Users, Clock, Building2, ArrowRight } from 'lucide-react';
import Meta from '../components/Meta';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Meta
        title="Về chúng tôi | YoungHouse Hoà Lạc"
        description="YoungHouse Hoà Lạc là hệ thống nhà trọ tiện nghi, an ninh, vận hành chuyên nghiệp dành cho sinh viên và người đi làm tại khu vực Hoà Lạc."
        url="https://younghousehoalac.com/about"
        image="/logo.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Về chúng tôi - YoungHouse Hoà Lạc',
          url: 'https://younghousehoalac.com/about'
        }}
      />

      <section className="about-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="kicker">YoungHouse Hoà Lạc</div>
              <h1>Hơn cả mái nhà – đó là mái ấm.</h1>
              <p className="lead">
                Chúng tôi xây dựng hệ thống nhà trọ sáng – thoáng – tiện nghi, vận hành chuyên nghiệp để bạn
                an tâm học tập, làm việc và tận hưởng cuộc sống tại Hoà Lạc.
              </p>

              <div className="hero-ctas">
                <Link to="/system-home" className="btn primary">
                  Tìm phòng ngay <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn secondary">Liên hệ tư vấn</Link>
              </div>

              <div className="hero-badges" aria-label="Điểm nổi bật">
                <div className="badge">
                  <ShieldCheck size={18} />
                  <span>An ninh & vận hành</span>
                </div>
                <div className="badge">
                  <Sparkles size={18} />
                  <span>Không gian sống chất lượng</span>
                </div>
              </div>
            </div>

            <div className="hero-card" aria-label="Tổng quan hệ thống">
              <div className="card-title">Tổng quan nhanh</div>
              <div className="stats">
                <div className="stat">
                  <Building2 size={18} />
                  <div>
                    <div className="stat-value">Nhiều cơ sở</div>
                    <div className="stat-label">Tân Xã · Phú Hữu · Bình Yên</div>
                  </div>
                </div>
                <div className="stat">
                  <MapPin size={18} />
                  <div>
                    <div className="stat-value">Gần FPT</div>
                    <div className="stat-label">Di chuyển thuận tiện hằng ngày</div>
                  </div>
                </div>
                <div className="stat">
                  <Clock size={18} />
                  <div>
                    <div className="stat-value">Hỗ trợ 24/7</div>
                    <div className="stat-label">Tư vấn & xử lý sự cố nhanh</div>
                  </div>
                </div>
                <div className="stat">
                  <Users size={18} />
                  <div>
                    <div className="stat-value">Cộng đồng trẻ</div>
                    <div className="stat-label">Thân thiện, văn minh</div>
                  </div>
                </div>
              </div>
              <div className="note">
                Mỗi phòng đều ưu tiên tiện nghi cơ bản, sạch sẽ, rõ ràng chi phí và quy trình.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="section-head">
            <h2>Chúng tôi làm gì?</h2>
            <p>
              YoungHouse tập trung vào 3 trụ cột: <strong>không gian</strong>, <strong>an ninh</strong> và <strong>dịch vụ</strong>.
              Mục tiêu là giúp bạn “chọn phòng đúng – xem phòng nhanh – dọn vào ở yên tâm”.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <h3>Không gian sống</h3>
              <p>Phòng sáng, thoáng; nội thất cơ bản; bố trí tối ưu để học tập và sinh hoạt.</p>
            </div>
            <div className="feature">
              <h3>An ninh</h3>
              <p>Khóa vân tay, camera, quy trình vận hành rõ ràng; ưu tiên an toàn cho cư dân.</p>
            </div>
            <div className="feature">
              <h3>Dịch vụ</h3>
              <p>Hỗ trợ 24/7, vệ sinh định kỳ khu vực chung, xử lý sự cố nhanh gọn.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section alt">
        <div className="container">
          <div className="section-head">
            <h2>Quy trình xem phòng & đặt lịch</h2>
            <p>Minh bạch, nhanh chóng, không rườm rà.</p>
          </div>

          <ol className="steps">
            <li>
              <div className="step-title">Chọn cơ sở & loại phòng</div>
              <div className="step-desc">Dùng bộ lọc theo khu vực, giá và tình trạng phòng.</div>
            </li>
            <li>
              <div className="step-title">Xem ảnh/video & vị trí</div>
              <div className="step-desc">Tham khảo trước để tiết kiệm thời gian di chuyển.</div>
            </li>
            <li>
              <div className="step-title">Đặt lịch xem phòng</div>
              <div className="step-desc">Đặt lịch trực tiếp trên trang chi tiết hoặc liên hệ tư vấn.</div>
            </li>
          </ol>

          <div className="cta-banner">
            <div>
              <div className="cta-title">Bạn cần tư vấn chọn phòng phù hợp?</div>
              <div className="cta-desc">Gửi nhu cầu (khu vực, ngân sách, số người) để được gợi ý nhanh.</div>
            </div>
            <Link to="/contact" className="btn primary">Liên hệ ngay</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

