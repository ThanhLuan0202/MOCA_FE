import React, { useEffect, useState } from 'react';
import { FaUserMd, FaClock, FaCalendarCheck } from 'react-icons/fa';
import apiClient from '../../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorSchedule = ({ setActiveView }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/api/DoctorBooking/GetAllByDoctor');
        setAppointments(res?.$values || []);
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Hàm format ngày giờ
  const formatDateTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Map consultationType sang text
  const consultationTypeText = (type) => {
    switch(type) {
      case 1: return 'Gọi video';
      case 2: return 'Gọi';
      case 3: return 'Tin nhắn';
      default: return 'Khác';
    }
  };

  // Hàm gọi API khi bấm Bắt đầu
  const handleStartContact = async (app) => {
    let contactMethod = 'message';
    if (app.consultationType === 2) contactMethod = 'call';
    if (app.consultationType === 3) contactMethod = 'Video call';
    try {
      await apiClient.post('https://moca.mom:2030/api/DoctorContact', {
        userId: app.userId,
        contactDate: app.bookingDate,
        contactMethod,
        status: 'active',
      });
      alert('Tạo liên hệ thành công!');
      if (setActiveView) setActiveView('chat');
    } catch (e) {
      alert('Tạo liên hệ thất bại!');
    }
  };

  return (
    <div className="doctor-schedule">
      <div className="schedule-header">
        <h2>Lịch hẹn của tôi</h2>
        <div className="date-display">
            <FaCalendarCheck />
            <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      <div className="appointment-list">
        {loading ? (
          <div>Đang tải lịch hẹn...</div>
        ) : appointments.length === 0 ? (
          <div>Không có lịch hẹn nào.</div>
        ) : appointments.map(app => {
          // Logic cho nút
          const now = new Date();
          const bookingDate = new Date(app.bookingDate);
          const isToday = now.toDateString() === bookingDate.toDateString();
          const diffMs = now - bookingDate;
          const diffMinutes = diffMs / (1000 * 60);
          let buttonLabel = 'Chi tiết';
          let buttonDisabled = false;
          let buttonClass = 'details-btn';

          if (isToday && diffMinutes >= 0 && diffMinutes <= 15) {
            buttonLabel = 'Bắt đầu';
            buttonDisabled = false;
            buttonClass = 'start-btn';
          } else if (now > bookingDate && (!isToday || diffMinutes > 15)) {
            buttonLabel = 'Hết hạn';
            buttonDisabled = true;
            buttonClass = 'expired-btn';
          } else if (bookingDate > now) {
            buttonLabel = 'Chờ đến giờ';
            buttonDisabled = true;
            buttonClass = 'waiting-btn';
          }

          return (
            <div key={app.bookingId} className="appointment-card">
              <img src={app.user?.image || 'https://via.placeholder.com/60'} alt={app.user?.fullName || 'Bệnh nhân'} className="patient-avatar" />
              <div className="appointment-details">
                <h4>{app.user?.fullName || 'Bệnh nhân'}</h4>
                <p><FaUserMd /> {consultationTypeText(app.consultationType)}</p>
                <p>Trạng thái: <b>{app.status}</b></p>
              </div>
              <div className="appointment-time">
                <FaClock />
                <span>{formatDateTime(app.bookingDate)}</span>
              </div>
              <button className={buttonClass} disabled={buttonDisabled}
                onClick={buttonLabel === 'Bắt đầu' ? () => handleStartContact(app) : undefined}
              >{buttonLabel}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorSchedule; 