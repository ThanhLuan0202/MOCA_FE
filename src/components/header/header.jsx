import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.scss';
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import authService from '../../services/auth';
import { FaRegPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout, currentUser } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showRegisterMom, setShowRegisterMom] = useState(true);
  
    const handleMouseEnter = () => setShowDropdown(true);
    const handleMouseLeave = () => setShowDropdown(false);
    const handleLogout = () => {
      authService.logout();
      logout();
      navigate("/login");
    };
  
    useEffect(() => {
      if (isLoggedIn && currentUser?.userId) {
        axios.get(`https://moca.mom:2030/api/MomProfile/GetUserById?userId=${currentUser.userId}`, { withCredentials: true })
          .then(res => {
            if (res && res.data) {
              setShowRegisterMom(false);
            } else {
              setShowRegisterMom(true);
            }
          })
          .catch(() => {
            setShowRegisterMom(true);
          });
      } else {
        setShowRegisterMom(true);
      }
    }, [isLoggedIn, currentUser]);
  
    return (
      <div className="header">
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
  
        <div className="nav-links">
          <Link to="/">
            <p>Home</p>
          </Link>
          {!(isLoggedIn && currentUser?.roleId === 4) && !showRegisterMom && (
            <Link to="/pregnancy-diary">
              <p>Nhật ký thai kỳ</p>
            </Link>
          )}
          <Link to="/services">
            <p>Dịch vụ</p>
          </Link>
  
          <Link to='/community'>
            <p>Cộng đồng</p>
          </Link>
  
          <Link to='/about-us'>
            <p>Chúng tôi</p>
          </Link>
          {isLoggedIn && currentUser?.roleId !== 4 && (
            <Link to="/booking-history">
              <p>Lịch hẹn</p>
            </Link>
          )}
          {isLoggedIn && currentUser?.roleId === 4 ? (
            <Link to="/doctor">
              <p>Bác sĩ</p>
            </Link>
          ) : (
            <div
              className={`register-dropdown ${showDropdown ? 'show' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <p>Đăng ký</p>
              <div
                className="dropdown-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ display: showDropdown ? 'block' : 'none' }}
              >
                {showRegisterMom && (
                  <Link to="/register/mom">
                    <button>Đăng ký Mẹ bầu</button>
                  </Link>
                )}
                <Link to="/register/doctor">
                  <button>Đăng ký Bác sĩ</button>
                </Link>
              </div>
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <div className="logged-in-icons">
            <button className="notification-button">
              <IoMdNotificationsOutline className="icon" />
              <span className="notification-badge">3</span>
            </button>
            {[3, 5].includes(currentUser?.roleId) && (
              <button className="chat-doctor-button" onClick={() => navigate('/chat-doctor')} title="Chat với bác sĩ">
                <FaRegPaperPlane className="icon" />
              </button>
            )}
            <Link to='/profile' className="user-avatar">
              <img src={currentUser?.image} alt="User Avatar" className="avatar-image" />
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <FiLogOut className="icon" />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login">
              <button className="login">Đăng nhập</button>
            </Link>
            <Link to="/register">
              <button className="register">Đăng ký</button>
            </Link>
          </div>
        )}
      </div>
    );
};
  
export default Header;
