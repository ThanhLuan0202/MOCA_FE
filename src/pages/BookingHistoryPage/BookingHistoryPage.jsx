import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingHistoryPage.scss';
import { FaUserMd } from 'react-icons/fa';

const consultationTypeText = (type) => {
  switch(type) {
    case 1: return 'Tin nhắn';
    case 2: return 'Gọi';
    case 3: return 'Gọi video';
    default: return 'Khác';
  }
};

const statusColor = (status) => {
  switch(status) {
    case 'Confirm': return '#4CAF50';
    case 'Pending': return '#FFC107';
    case 'Cancel': return '#F44336';
    default: return '#888';
  }
};

const formatDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const statusText = (status) => {
  if (status === 'Confirm') return 'Đã thanh toán';
  return status;
};

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(
          'https://moca.mom:2030/api/DoctorBooking/GetAllByUser',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setBookings(res.data.$values || []);
      } catch (err) {
        setError('Không thể tải lịch hẹn!');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="booking-history-page">
      <h1>Lịch hẹn của tôi</h1>
      {loading && <div className="loading">Đang tải lịch hẹn...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && bookings.length === 0 && (
        <div className="empty">Bạn chưa có lịch hẹn nào.</div>
      )}
      <div className="booking-list">
        {bookings.map(booking => (
          <div className="booking-card" key={booking.bookingId}>
            <div className="doctor-info">
              <div className="doctor-avatar doctor-avatar-icon">
                <FaUserMd size={38} color="#6a5af9" />
              </div>
              <div>
                <div className="doctor-name">{booking.doctor?.fullName}</div>
                <div className="doctor-specialization">{booking.doctor?.specialization}</div>
              </div>
            </div>
            <div className="booking-details">
              <div><b>Ngày giờ:</b> <span>{formatDateTime(booking.bookingDate)}</span></div>
              <div><b>Trạng thái:</b> <span style={{color: statusColor(booking.status), fontWeight: 600}}>{statusText(booking.status)}</span></div>
              <div><b>Ghi chú:</b> {booking.notes || 'Không có'}</div>
            </div>
            <div className="booking-price">
              <div><b>Phí:</b> {booking.price?.toLocaleString('vi-VN')} VNĐ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistoryPage; 