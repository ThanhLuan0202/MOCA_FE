import React from 'react';
import { FaUsers, FaUserMd, FaBook, FaShoppingCart, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AllMenu.scss';

const AllMenu = ({ stats, recentActivity, loading, error, onRefresh }) => {
  const quickActions = [
    { label: 'View Users', icon: <FaUsers />, path: '/admin-dashboard/users' },
    { label: 'View Doctor', icon: <FaUserMd />, path: '/admin-dashboard/doctor' },
    { label: 'Khóa học', icon: <FaBook />, path: '/admin-dashboard/courses' },
    { label: 'Gói đã mua ', icon: <FaShoppingCart />, path: '#' },
  ];
  
  const statCards = [
    { title: 'Tổng người dùng', value: stats.users, icon: <FaUsers/>, style: 'users' },
    { title: 'Mẹ', value: stats.purchases, icon: <FaShoppingCart/>, style: 'purchases' },
    { title: 'Bác sĩ', value: stats.doctors, icon: <FaUserMd/>, style: 'doctors' },
    { title: 'Tổng khóa học', value: stats.courses, icon: <FaBook/>, style: 'courses' },
  ];

  if (loading) return <div className="loading-state">Đang tải...</div>;
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Chào mừng trở lại! Đây là những gì đang diễn ra với hệ thống của bạn hôm nay.</p>
        </div>
        <div className="header-actions">
          <button onClick={onRefresh} className="btn-secondary">
            <FaSync />
            Làm mới
          </button>
        </div>
      </header>
      
      {error && <div className="error-state">{error}</div>}

      <div className="stats-grid">
        {statCards.map((card, index) => (
            <div className="stat-card-item" key={index}>
                <div className="card-content">
                    <p className="card-title">{card.title}</p>
                    <p className="card-value">{card.value}</p>
                </div>
                <div className={`card-icon-wrapper ${card.style}`}>{card.icon}</div>
            </div>
        ))}
      </div>

      <div className="main-content-grid">
        <div className="content-card">
          <h3>Hoạt động gần đây</h3>
          <p>Các hoạt động và cập nhật hệ thống mới nhất (24 giờ qua)</p>
          <ul className="recent-activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity) => (
                <li key={activity.id}>
                  <span className={`status-dot ${activity.status || 'info'}`}></span>
                  <div className="activity-text">
                    <p>{activity.text}</p>
                    <span>{new Date(activity.time).toLocaleString('vi-VN')}</span>
                  </div>
                  <span className={`status-label ${activity.status || 'info'}`}>{activity.status}</span>
                </li>
              ))
            ) : (
              <li className="no-activity">Không có hoạt động gần đây để hiển thị.</li>
            )}
          </ul>
        </div>
        <div className="content-card">
          <h3>Hành động nhanh</h3>
          <p>Các tác vụ quản trị thông thường</p>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link to={action.path} className="action-button" key={index}>
                <div className="action-icon">{action.icon}</div>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMenu;
