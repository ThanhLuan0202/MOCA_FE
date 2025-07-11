import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccessPage.scss';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-success-container">
      <div className="success-icon">🎉</div>
      <h1>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</h1>
      <p>Thanh toán của bạn đã được xử lý thành công.<br/>Chúc bạn luôn mạnh khỏe và hạnh phúc!</p>
      <button className="back-home-btn" onClick={() => navigate('/')}>Về trang chủ</button>
    </div>
  );
};

export default PaymentSuccessPage; 