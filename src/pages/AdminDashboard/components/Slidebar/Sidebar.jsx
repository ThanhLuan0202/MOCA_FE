import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Sidebar.scss";

const menuItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill="#222"/><rect x="14" y="3" width="7" height="7" rx="2" fill="#222"/><rect x="14" y="14" width="7" height="7" rx="2" fill="#222"/><rect x="3" y="14" width="7" height="7" rx="2" fill="#222"/></svg>
    ),
    path: "/admin-dashboard",
  },
  {
    label: "Quản lý Users",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#222" strokeWidth="2"/><path stroke="#222" strokeWidth="2" d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
    ),
    path: "/admin-dashboard/users",
  },
  {
    label: "Doctor",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#222" strokeWidth="2"/><path stroke="#222" strokeWidth="2" d="M16 3v4M8 3v4"/></svg>
    ),
    path: "/admin-dashboard/doctor",
  },
  {
    label: "Mom",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="6.5" cy="6.5" r="2.5" fill="#222"/><circle cx="17.5" cy="6.5" r="2.5" fill="#222"/><circle cx="12" cy="17.5" r="2.5" fill="#222"/></svg>
    ),
    path: "/admin-dashboard/mom",
  },
  {
    label: "Courses",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#222" strokeWidth="2"/><path stroke="#222" strokeWidth="2" d="M3 7l9 6 9-6"/></svg>
    ),
    path: "/admin-dashboard/courses",
  },
  
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Admin Panel</div>
      <div className="sidebar-section">MENU CHÍNH</div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            className={
              location.pathname === item.path
                ? "sidebar-link active"
                : "sidebar-link"
            }
            key={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
