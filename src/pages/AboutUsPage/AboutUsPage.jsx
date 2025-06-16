import React from 'react';
import './AboutUsPage.scss';
import LineGarden from '../../assets/LineGarden.png'; // Giả sử bạn có hình ảnh sóng này trong assets
import babauDrikMilk from '../../assets/babauDrikMilk.jpg'; // Giả sử bạn có hình ảnh phụ nữ mang thai này
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <section className="about-us-header">
        <h1>Chúng tôi ở đây để giúp bạn và con có một thai kỳ khỏe mạnh!</h1>
        <p>Hãy để bác sĩ chuyên gia giải đáp những thắc mắc giúp bạn</p>
        <div className="header-buttons">
          <Link to="/booking" className="button primary">Đặt lịch ngay</Link>
          <Link to='/community' className="button secondary">Tìm hiểu thêm</Link>
        </div>
      </section>

      <section className="wave-section">
        <img src={LineGarden} alt="Wave Background" className="wave-image" />
      </section>

      <section className="intro-text-section">
        <p>
          Chúng tôi cung cấp nền tảng hỗ trợ chăm sóc sức khỏe thai kỳ cá nhân hóa bằng AI – giúp mẹ bầu theo dõi quá trình mang thai,
          nhận tư vấn phù hợp và kết nối cộng đồng một cách an toàn và tiện lợi.
        </p>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h2>1/3</h2>
          <h3>Phụ nữ đang mang thai</h3>
          <p>Mỗi năm có hơn 1/3 phụ nữ mang thai lần đầu và trên thế giới gặp các vấn đề sức khỏe tâm thần.</p>
        </div>
        <div className="stat-card">
          <h2>200%</h2>
          <h3>Số lượt tư vấn khám bệnh trực tuyến</h3>
          <p>Tăng 200% số lượt khám bệnh trực tuyến tại Việt Nam trong giai đoạn 2019-2021.</p>
        </div>
        <div className="stat-card">
          <h2>70%</h2>
          <h3>Thai phụ lo lắng</h3>
          <p>Hơn 70% thai phụ có những lo lắng về tâm lý trong thai kỳ của mình.</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-image-container">
          <img src={babauDrikMilk} alt="Pregnant Woman" className="mission-image" />
        </div>
        <div className="mission-content">
          <div className="mission-text-block">
            <h3>Sứ hình thành của MOCA</h3>
            <p>
              MOCA ra đời với sứ mệnh đồng hành cùng phụ nữ mang thai trong hành trình làm mẹ, cung cấp kiến thức, dịch vụ y tế
              chuyên nghiệp và cộng đồng hỗ trợ. Chúng tôi tin rằng mỗi người mẹ đều xứng đáng được chăm sóc tốt nhất để có một thai kỳ khỏe mạnh và hạnh phúc.
            </p>
          </div>
          <div className="mission-text-block">
            <h3>Sự phát triển của MOCA</h3>
            <p>
              Kể từ khi ra mắt, MOCA đã không ngừng đổi mới và cải thiện để mang đến trải nghiệm tốt nhất cho người dùng.
              Chúng tôi đã tích hợp công nghệ AI tiên tiến, mở rộng mạng lưới bác sĩ chuyên gia và xây dựng cộng đồng vững mạnh.
            </p>
          </div>
          <div className="mission-text-block">
            <h3>CEO MOCA</h3>
            <p>Standby By From GMT</p>
            <p>Trần Quốc Toàn</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;