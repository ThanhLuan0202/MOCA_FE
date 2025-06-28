import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentCallbackPage.scss';

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Đang xử lý thanh toán...');

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Lấy các tham số từ URL callback
        const paymentId = searchParams.get('paymentId');
        const bookingId = searchParams.get('bookingId');
        const amount = searchParams.get('amount');
        const service = searchParams.get('service');
        const bookingTime = searchParams.get('bookingTime');

        console.log('Payment callback params:', {
          paymentId,
          bookingId,
          amount,
          service,
          bookingTime
        });

        // Nếu có đầy đủ thông tin, coi như thanh toán thành công
        if (paymentId && bookingId) {
          setStatus('success');
          setMessage('Thanh toán thành công! Chuyển hướng về trang chủ...');
          
          // Chờ 3 giây rồi chuyển về trang chủ
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Thanh toán thất bại hoặc bị hủy.');
          
          // Chờ 3 giây rồi chuyển về trang đặt lịch
          setTimeout(() => {
            navigate('/booking');
          }, 3000);
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xử lý thanh toán.');
        
        setTimeout(() => {
          navigate('/booking');
        }, 3000);
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate]);

  return (
    <div className="payment-callback-page">
      <div className="callback-container">
        <div className={`callback-card ${status}`}>
          {status === 'processing' && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
          )}
          
          <h2>
            {status === 'processing' && 'Đang xử lý...'}
            {status === 'success' && 'Thanh toán thành công!'}
            {status === 'error' && 'Thanh toán thất bại'}
          </h2>
          
          <p>{message}</p>
          
          {status === 'success' && (
            <div className="success-details">
              <p>Lịch hẹn của bạn đã được xác nhận.</p>
              <p>Bác sĩ sẽ liên hệ với bạn sớm nhất.</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="error-details">
              <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage; 