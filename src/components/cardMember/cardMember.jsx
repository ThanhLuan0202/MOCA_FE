import React from 'react';
import './cardMember.scss'; // Import the SCSS file
import { FaCheck } from "react-icons/fa"; // Assuming you have react-icons installed

const CardMemberSection = () => {
  return (
    <div className="card-member-section">
      <div className="container">
        <h2>Nâng cấp ngay</h2>
        <div className="cards-container">

          

          {/* Gói 1 tháng */}
          <div className="member-card monthly">
             <div className="package-header">
              <span className="package-title">Gói 1 tháng</span>
              <span className="package-badge">Giá ưu đãi</span>
            </div>
            <div className="package-price">2.499.000₫</div>
             <p className="package-description">Sẵn sàng giải đáp mọi thắc mắc và chuẩn đoán với trợ thủ AI 24/7. Kết nối với bác sĩ chuyên khoa mọi lúc mọi nơi.</p>
            <ul className="package-features">
              <li><FaCheck className="check-icon" /> Cá nhân hóa trải nghiệm theo dõi thai kỳ</li>
              <li><FaCheck className="check-icon" /> Miễn phí 10 cuộc gọi đầu tiên với bác sĩ chuyên khoa</li>
              <li><FaCheck className="check-icon" /> AI đưa ra chuẩn đoán từ những triệu chứng</li>
              <li><FaCheck className="check-icon" /> Trải nghiệm các khóa học miễn phí</li>
            </ul>
            <button className="package-button primary">Nâng cấp ngay</button>
          </div>

          {/* Gói 3 tháng */}
          <div className="member-card monthly">
             <div className="package-header">
              <span className="package-title">Gói 3 tháng</span>
              <span className="package-badge">Giá ưu đãi</span>
            </div>
            <div className="package-price">6.999.000₫</div>
             <p className="package-description">Sẵn sàng giải đáp mọi thắc mắc và chuẩn đoán với trợ thủ AI 24/7. Kết nối với bác sĩ chuyên khoa mọi lúc mọi nơi.</p>
            <ul className="package-features">
              <li><FaCheck className="check-icon" /> Cá nhân hóa trải nghiệm theo dõi thai kỳ</li>
              <li><FaCheck className="check-icon" /> Miễn phí 30 cuộc gọi đầu tiên với bác sĩ chuyên khoa</li>
              <li><FaCheck className="check-icon" /> AI đưa ra chuẩn đoán từ những triệu chứng</li>
              <li><FaCheck className="check-icon" /> Trải nghiệm các khóa học miễn phí</li>
            </ul>
            <button className="package-button primary">Nâng cấp ngay</button>
          </div>

          {/* Gói 6 tháng */}
          <div className="member-card monthly">
             <div className="package-header">
              <span className="package-title">Gói 6 tháng</span>
              <span className="package-badge">Giá ưu đãi</span>
            </div>
            <div className="package-price">12.999.000₫</div>
             <p className="package-description">Sẵn sàng giải đáp mọi thắc mắc và chuẩn đoán với trợ thủ AI 24/7. Kết nối với bác sĩ chuyên khoa mọi lúc mọi nơi.</p>
            <ul className="package-features">
              <li><FaCheck className="check-icon" /> Cá nhân hóa trải nghiệm theo dõi thai kỳ</li>
              <li><FaCheck className="check-icon" /> Miễn phí 60 cuộc gọi đầu tiên với bác sĩ chuyên khoa</li>
              <li><FaCheck className="check-icon" /> AI đưa ra chuẩn đoán từ những triệu chứng</li>
              <li><FaCheck className="check-icon" /> Trải nghiệm các khóa học miễn phí</li>
            </ul>
            <button className="package-button primary">Nâng cấp ngay</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardMemberSection;