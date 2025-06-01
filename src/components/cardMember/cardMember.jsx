import React from 'react';
import './cardMember.scss'; // Import the SCSS file
import { FaCheck } from "react-icons/fa"; // Assuming you have react-icons installed

const CardMemberSection = () => {
  return (
    <div className="card-member-section">
      <div className="container">
        <h2>Nâng cấp ngay</h2>
        <div className="cards-container">

          {/* Gói Tiêu Chuẩn */}
          <div className="member-card standard">
            <div className="package-header">
              <span className="package-title">Gói tiêu chuẩn  </span>
            </div>
            <div className="package-price free">MIỄN PHÍ</div>
            <p className="package-description">Dành cho bạn muốn tìm hiểu và theo dõi thai kỳ cùng những khóa học miễn phí.</p>
            <ul className="package-features">
              <li><FaCheck className="check-icon" /> Miễn phí cuộc gọi đầu tiên với bác sĩ chuyên khoa</li>
              <li><FaCheck className="check-icon" /> Trải nghiệm các khóa học miễn phí</li>
              <li><FaCheck className="check-icon" /> Theo dõi sức khỏe thai kỳ cơ bản</li>
              <li><FaCheck className="check-icon" /> AI đưa ra chuẩn đoán từ những triệu chứng</li>
            </ul>
            <button className="package-button">Phiên bản đang sử dụng</button>
          </div>

          {/* Gói 1 tháng */}
          <div className="member-card monthly">
             <div className="package-header">
              <span className="package-title">Gói 1 tháng</span>
              <span className="package-badge">Giá ưu đãi</span>
            </div>
            <div className="package-price">499.000VNĐ</div>
             <p className="package-description">Sẵn sàng giải đáp mọi thắc mắc và chuẩn đoán với trợ thủ AI 24/7. Kết nối với bác sĩ chuyên khoa mọi lúc mọi nơi.</p>
            <ul className="package-features">
              <li><FaCheck className="check-icon" /> Cá nhân hóa trải nghiệm theo dõi thai kỳ</li>
              <li><FaCheck className="check-icon" /> Miễn phí 10 cuộc gọi đầu tiên với bác sĩ chuyên khoa</li>
              <li><FaCheck className="check-icon" /> AI đưa ra chuẩn đoán từ những triệu chứng</li>
              <li><FaCheck className="check-icon" /> Trải nghiệm các khóa học miễn phí</li>
            </ul>
            <button className="package-button primary">Nâng cấp ngay</button>
          </div>

          {/* Gói 12 tháng */}
          <div className="member-card yearly">
             <div className="package-header">
              <span className="package-title">Gói 12 tháng</span>
            </div>
            <div className="package-price">4.399.000VNĐ</div>
             <p className="package-description">Sự lựa chọn hoàn hảo cho một thai kỳ an toàn và khỏe mạnh!</p>
            <ul className="package-features">
              <li><FaCheck className="check-icon" /> Cá nhân hóa trải nghiệm theo dõi thai kỳ</li>
              <li><FaCheck className="check-icon" /> Miễn phí 150 cuộc gọi đầu tiên với bác sĩ chuyên khoa</li>
              <li><FaCheck className="check-icon" /> AI đưa ra chuẩn đoán từ những triệu chứng</li>
              <li><FaCheck className="check-icon" /> Trải nghiệm các khóa học miễn phí</li>
               <li><FaCheck className="check-icon" /> Thời gian biểu hợp lý theo khuyến cáo của bác sĩ</li>
            </ul>
            <button className="package-button">Nâng cấp ngay</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardMemberSection;