import React from 'react';
import './Register.scss';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [birthDate, setBirthDate] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Tạo tài khoản</h1>
        <p>Chào mừng bạn đến với Moca! Chúc bạn và bé một ngày vui vẻ và tràn đầy sức khỏe!</p>

        <div className="form-group">
          <label htmlFor="fullName">Họ và tên?</label>
          <input type="text" id="fullName" placeholder="Họ và tên của bạn" />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Ngày tháng năm sinh</label>
          <div className="input-with-icon">
            <DatePicker
              selected={birthDate}
              onChange={(date) => setBirthDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YY"
              customInput={<input type="text" id="dob" />}
              toggleCalendarOnIconClick
              showIcon
              icon={
                <FaCalendarAlt className="icon" style={{ cursor: 'pointer' }} />
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Địa chỉ email</label>
          <input type="email" id="email" placeholder="Địa chỉ email của bạn" />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input type="tel" id="phone" placeholder="Số điện thoại của bạn" />
        </div>

        <div className="form-group">
          <label htmlFor="password">Tạo mật khẩu*</label>
          <div className="input-with-icon">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Tạo mật khẩu"
            />
            {showPassword ? (
              <FaEyeSlash className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
            ) : (
              <FaEye className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Nhập lại mật khẩu*</label>
          <div className="input-with-icon">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu"
            />
            {showConfirmPassword ? (
              <FaEyeSlash className="icon" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }} />
            ) : (
              <FaEye className="icon" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }} />
            )}
          </div>
        </div>

        <button className="register-button">Đăng ký</button>

        <div className="login-with-google">
          <p>Đăng nhập với</p>
          {/* Google icon placeholder */}
          <FcGoogle className="google-icon-2"/>
        </div>
      </div>
    </div>
  );
}

export default Register;
