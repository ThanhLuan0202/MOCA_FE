import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentCancelPage.scss';

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  return (
    <div className="payment-cancel-container">
      <div className="cancel-icon">😢</div>
      <h1>Thanh toán đã bị hủy</h1>
      <p>Rất tiếc, giao dịch của bạn chưa được hoàn tất.<br/>Bạn có thể thử lại hoặc liên hệ hỗ trợ nếu cần giúp đỡ.</p>
      <button className="back-home-btn" onClick={() => navigate('/')}>Về trang chủ</button>
    </div>
  );
};

export default PaymentCancelPage; 