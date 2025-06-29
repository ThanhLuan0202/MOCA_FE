import React, { useState } from 'react';
import './DoctorPage.scss';
import { useAuth } from '../../contexts/AuthContext';
import { FaCalendarAlt, FaComments, FaUserCog } from 'react-icons/fa';

import DoctorSchedule from './components/DoctorSchedule';
import DoctorChat from './components/DoctorChat';
import DoctorSettings from './components/DoctorSettings';


const DoctorPage = () => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState('schedule'); // 'schedule', 'chat', 'settings'

  const renderActiveView = () => {
    switch (activeView) {
      case 'schedule':
        return <DoctorSchedule setActiveView={setActiveView} />;
      case 'chat':
        return <DoctorChat />;
      case 'settings':
        return <DoctorSettings />;
      default:
        return <DoctorSchedule />;
    }
  };

  return (
    <div className="doctor-page">
      <div className="doctor-sidebar">
        <div className="sidebar-header">
          <h3>Bác sĩ</h3>
          <p>{currentUser?.fullName || 'Doctor'}</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeView === 'schedule' ? 'active' : ''} onClick={() => setActiveView('schedule')}>
              <FaCalendarAlt />
              <span>Lịch khám</span>
            </li>
            <li className={activeView === 'chat' ? 'active' : ''} onClick={() => setActiveView('chat')}>
              <FaComments />
              <span>Chat</span>
            </li>
            <li className={activeView === 'settings' ? 'active' : ''} onClick={() => setActiveView('settings')}>
              <FaUserCog />
              <span>Cài đặt</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="doctor-main-content">
        <div className="content-area">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default DoctorPage; 