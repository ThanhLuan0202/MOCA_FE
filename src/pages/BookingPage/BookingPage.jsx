import React, { useState, useEffect } from 'react';
import './BookingPage.scss'; // Import the SCSS file for styling
import apiClient from '../../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Thêm import axios trực tiếp
import CustomModal from '../../components/CustomModal';

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    date: '',
    time: '',
    doctor: null,
    description: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    // Lấy danh sách bác sĩ từ API (vẫn dùng apiClient)
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await apiClient.get('/api/DoctorProfile');
        const doctorArr = res?.$values || [];
        setDoctors(doctorArr);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
    '20:00'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeClick = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleDoctorSelect = (doctor) => {
    setFormData(prev => ({ ...prev, doctor }));
  };

  const handleShowDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleCloseDoctorModal = () => {
    setShowDoctorModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(false);
    setBookingError('');
    setIsSubmitting(true);

    if (!formData.doctor || !formData.date || !formData.time) {
      setBookingError('Vui lòng chọn bác sĩ, ngày và giờ!');
      setIsSubmitting(false);
      return;
    }

    const bookingDate = new Date(`${formData.date}T${formData.time}:00`);

    try {
      const bookingData = {
        doctorId: formData.doctor.doctorId,
        bookingDate: bookingDate.toISOString(),
        consultationType: 1,
        requiredDeposit: 0,
        status: 'Pending',
        notes: formData.description || '',
        price: 150000
      };
      // Gọi API tạo booking
      const response = await apiClient.post('https://moca.mom:2030/api/DoctorBooking/create', bookingData);
      const bookingId = response?.booking?.bookingId || response?.bookingId;
      if (!bookingId) throw new Error('Không lấy được bookingId');
      // Gọi API lấy paymentUrl
      const payRes = await apiClient.post(`https://moca.mom:2030/api/PayOS/create-payment-url/${bookingId}`);
      const paymentUrl = payRes?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setBookingSuccess(true);
        setBookingError('Không lấy được link thanh toán!');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('Đặt lịch thất bại! Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = formData.date === todayStr;
  const now = new Date();

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Thông tin đặt lịch</h1>
        <p>Hãy để bác sĩ chuyên gia giải đáp những thắc mắc giúp bạn</p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="card-section">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="fullName">Họ tên đầy đủ</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ tên đầy đủ của bạn"
              />
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="date">Ngày và giờ</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={todayStr}
              />
            </div>
            <div className="form-group time-slots-group">
              <label>Thời gian</label>
              <div className="time-slots">
                {timeSlots.map(time => {
                  let disabled = false;
                  if (isToday) {
                    // Chỉ enable time slot cách hiện tại >= 2 tiếng
                    const [h, m] = time.split(':');
                    const slotDate = new Date(formData.date + 'T' + time + ':00');
                    const diffMs = slotDate - now;
                    if (diffMs < 2 * 60 * 60 * 1000) disabled = true;
                  }
                  return (
                    <button
                      key={time}
                      type="button"
                      className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                      onClick={() => handleTimeClick(time)}
                      disabled={disabled}
                      style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="form-group doctor-select">
            <label>Chọn Bác sĩ</label>
            {loadingDoctors ? (
              <div>Đang tải danh sách bác sĩ...</div>
            ) : (
              <div className="doctor-list">
                {doctors.map(doctor => (
                  <div
                    key={doctor.doctorId}
                    className={`doctor-card${formData.doctor?.doctorId === doctor.doctorId ? ' selected' : ''}`}
                    onClick={() => handleDoctorSelect(doctor)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      border: formData.doctor?.doctorId === doctor.doctorId ? '2.5px solid #6a5af9' : '1.5px solid #e0e0e0',
                      borderRadius: 12, padding: '14px 18px', marginBottom: 14, background: formData.doctor?.doctorId === doctor.doctorId ? '#f3f0ff' : '#fff', cursor: 'pointer', boxShadow: formData.doctor?.doctorId === doctor.doctorId ? '0 2px 12px #6a5af922' : '0 1px 4px #eee', transition: 'all 0.18s', minHeight: 56
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 17, color: '#2d1e6b' }}>{doctor.fullName}</div>
                      <div style={{ fontSize: 14, color: '#8f6aff' }}>{doctor.specialization}</div>
                    </div>
                    <button
                      type="button"
                      style={{ marginLeft: 18, background: 'linear-gradient(90deg,#6a5af9 60%,#8f6aff 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 6px #6a5af922', transition: 'background 0.2s' }}
                      onClick={e => { e.stopPropagation(); handleShowDoctorModal(doctor); }}
                    >
                      Thông tin bác sĩ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card-section">
          <div className="form-group description-box">
            <label htmlFor="description">Mô tả về vấn đề bạn cần tư vấn</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả vấn đề bạn cần tư vấn..."
              rows="5"
            ></textarea>
          </div>
          <div className="form-group pricing-info">
            <label>Thông tin thanh toán</label>
            <div className="pricing-details">
              <p><strong>Phí tư vấn:</strong> 150,000 VNĐ</p>
              <p><strong>Tổng cộng:</strong> 150,000 VNĐ</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
        </button>
      </form>

      {bookingSuccess && <div className="success-message">Đặt lịch thành công!</div>}
      {bookingError && <div className="error-message">{bookingError}</div>}

      {showDoctorModal && selectedDoctor && (
        <CustomModal title="Chi tiết bác sĩ" onClose={handleCloseDoctorModal}>
          <div style={{lineHeight:'1.7'}}>
            <div><strong>Họ tên:</strong> {selectedDoctor.fullName}</div>
            <div><strong>Chuyên môn:</strong> {selectedDoctor.specialization}</div>
            <div><strong>Mô tả:</strong> {selectedDoctor.description}</div>
            {/* Thêm các trường khác nếu cần */}
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default BookingPage;