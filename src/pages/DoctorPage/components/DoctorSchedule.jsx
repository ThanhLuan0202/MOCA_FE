import React from 'react';
import { FaUserMd, FaClock, FaCalendarCheck } from 'react-icons/fa';

const appointments = [
  { id: 1, name: 'Nguyễn Thị An', time: '09:00 AM', type: 'Khám định kỳ', avatar: 'https://randomuser.me/api/portraits/women/75.jpg' },
  { id: 2, name: 'Trần Văn Bình', time: '10:30 AM', type: 'Tư vấn', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 3, name: 'Lê Thị Cẩm', time: '01:15 PM', type: 'Siêu âm', avatar: 'https://randomuser.me/api/portraits/women/76.jpg' },
  { id: 4, name: 'Phạm Văn Dũng', time: '03:00 PM', type: 'Khám tổng quát', avatar: 'https://randomuser.me/api/portraits/men/76.jpg' },
];

const DoctorSchedule = () => {
  return (
    <div className="doctor-schedule">
      <div className="schedule-header">
        <h2>Lịch hẹn hôm nay</h2>
        <div className="date-display">
            <FaCalendarCheck />
            <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      <div className="appointment-list">
        {appointments.map(app => (
          <div key={app.id} className="appointment-card">
            <img src={app.avatar} alt={app.name} className="patient-avatar" />
            <div className="appointment-details">
              <h4>{app.name}</h4>
              <p><FaUserMd /> {app.type}</p>
            </div>
            <div className="appointment-time">
              <FaClock />
              <span>{app.time}</span>
            </div>
            <button className="details-btn">Chi tiết</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSchedule; 