import React, { useState, useEffect } from 'react';
import './cardMember.scss'; // Import the SCSS file
import { FaCheck } from "react-icons/fa"; // Assuming you have react-icons installed
import apiClient from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CardMemberSection = () => {
  const [loading, setLoading] = useState(null); // null hoặc 1/2/3
  const [purchased, setPurchased] = useState([]); // chứa các packageId đã mua
  const navigate = useNavigate();

  // Kiểm tra đăng nhập
  const isLoggedIn = !!localStorage.getItem('authToken');

  useEffect(() => {
    if (isLoggedIn) {
      apiClient.get('https://moca.mom:2030/api/PurchasedPackage/GetEnroll')
        .then(res => {
          const arr = (res?.$values || []).map(item => item.packageId);
          setPurchased(arr);
        })
        .catch(() => setPurchased([]));
    }
  }, [isLoggedIn]);

  const handleUpgrade = async (packageId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setLoading(packageId);
    try {
      console.log('Bấm nâng cấp gói:', packageId);
      const now = new Date().toISOString();
      const res = await apiClient.post('https://moca.mom:2030/api/PurchasedPackage', {
        packageId,
        purchaseDate: now,
        status: 'Pending',
        discountId: 1
      });
      console.log('Kết quả mua gói:', res);
      const purchasePackageId = res?.purchasePackageId;
      if (!purchasePackageId) throw new Error('Không lấy được purchasePackageId');
      const payRes = await apiClient.post(`https://moca.mom:2030/api/PayPackage/create-payment-url/${purchasePackageId}`);
      console.log('Kết quả lấy paymentUrl:', payRes);
      const paymentUrl = payRes?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert('Không lấy được link thanh toán!');
      }
    } catch (err) {
      alert('Có lỗi khi nâng cấp gói!');
      console.error('Lỗi nâng cấp gói:', err);
    } finally {
      setLoading(null);
    }
  };

  const isPurchased = (id) => purchased.includes(id);

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
            <button className="package-button primary" onClick={() => handleUpgrade(1)} disabled={loading === 1 || isPurchased(1)}>{isPurchased(1) ? 'Đã mua' : (loading === 1 ? 'Đang xử lý...' : 'Nâng cấp ngay')}</button>
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
            <button className="package-button primary" onClick={() => handleUpgrade(2)} disabled={loading === 2 || isPurchased(2)}>{isPurchased(2) ? 'Đã mua' : (loading === 2 ? 'Đang xử lý...' : 'Nâng cấp ngay')}</button>
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
            <button className="package-button primary" onClick={() => handleUpgrade(3)} disabled={loading === 3 || isPurchased(3)}>{isPurchased(3) ? 'Đã mua' : (loading === 3 ? 'Đang xử lý...' : 'Nâng cấp ngay')}</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardMemberSection;