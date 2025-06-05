import React, { useState, useEffect } from 'react';
import './WaitConfirmPage.scss';
import { Link } from 'react-router-dom';

const WaitConfirmPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'

  useEffect(() => {
    // Simulate email verification process
    const timer = setTimeout(() => {
      // In a real application, you would call your backend API here
      // and set status based on API response.
      // For now, we simulate success after a delay.
      setVerificationStatus('success');
    }, 3000); // Simulate a 3-second verification time

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  return (
    <div className="wait-confirm-container">
      <div className="wait-confirm-content">
        {verificationStatus === 'verifying' && (
          <div className="message verifying">
            <h2>Đang xác thực email của bạn...</h2>
            <p>Vui lòng chờ trong giây lát.</p>
            {/* Optional: Add a loading spinner */}
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="message success">
            <h2>Xác thực email thành công!</h2>
            <p>Email của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập.</p>
            <Link to="/login" className="login-link">Đi đến trang Đăng nhập</Link>
          </div>
        )}

        {/* Add error state handling if needed */}
        {/* verificationStatus === 'error' && (...) */}

      </div>
    </div>
  );
};

export default WaitConfirmPage;