import React from "react";
import logo from "../../assets/logo.png";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo" />

      <div className="nav-links">
        <Link to="/">
          <p>Home</p>
        </Link>
        <Link to="/pregnancy-diary">
          <p>Nhật ký thai kỳ</p>
        </Link>
        <Link to="/services">
          <p>Dịch vụ</p>
        </Link>

        <Link>
          <p>Cộng đồng</p>
        </Link>

        <Link>
          <p>Chúng tôi</p>
        </Link>
      </div>
      {isLoggedIn ? (
        <div className="logged-in-icons">
          <button className="notification-button">
            <IoMdNotificationsOutline className="icon" />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-avatar">
            <FaRegUserCircle className="icon" />
          </div>
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
