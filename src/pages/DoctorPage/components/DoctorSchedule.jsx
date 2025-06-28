import React, { useEffect, useState } from 'react';
import { FaUserMd, FaClock, FaCalendarCheck } from 'react-icons/fa';
import apiClient from '../../../services/api';

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        ) : appointments.map(app => (
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
            <button className="details-btn">Chi tiết</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSchedule; 