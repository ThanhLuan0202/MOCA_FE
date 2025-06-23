import React, { useState, useEffect } from 'react';
import './BookingPage.scss'; // Import the SCSS file for styling
import apiClient from '../../services/api';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    date: '',
    time: '',
    service: '',
    doctor: null,
    consultationType: 'Goi video', // Default to 'Goi video'
    description: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    // Lấy danh sách bác sĩ từ API
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await apiClient.get('/api/DoctorProfile');
        const doctorArr = res?.$values || [];
        setDoctors(doctorArr);
      } catch (err) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(false);
    setBookingError('');
    // Validate
    if (!formData.doctor || !formData.date || !formData.time) {
      setBookingError('Vui lòng chọn bác sĩ, ngày và giờ!');
      return;
    }
    // Ghép ngày và giờ thành bookingDate ISO
    const bookingDate = new Date(`${formData.date}T${formData.time}:00`);
    // Map consultationType về số nếu cần
    let consultationType = 0;
    if (formData.consultationType === 'Goi video') consultationType = 1;
    else if (formData.consultationType === 'Goi') consultationType = 2;
    else if (formData.consultationType === 'Tin nhan') consultationType = 3;
    // Gửi booking
    try {
      await apiClient.post('/api/DoctorBooking', {
        doctorId: formData.doctor.doctorId,
        bookingDate: bookingDate.toISOString(),
        consultationType,
        requiredDeposit: 100000,
        status: 'Pending',
        notes: formData.description,
        price: 200000
      });
      setBookingSuccess(true);
      setBookingError('');
    } catch (err) {
      setBookingError('Đặt lịch thất bại!');
    }
  };

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
                placeholder="Kevin Dalmian"
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
                placeholder="0909090909090"
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
                placeholder="kevindalm890@gmail.com"
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
              />
            </div>
            <div className="form-group time-slots-group">
              <label>Thời gian</label>
              <div className="time-slots">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="form-group service-select">
            <label htmlFor="service">Lựa chọn dịch vụ</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Chọn dịch vụ</option>
              {/* Add service options here */}
              <option value="tu-van-thai-ky">Tư vấn thai kỳ</option>
              <option value="kham-thai">Khám thai</option>
            </select>
          </div>

          <div className="form-group doctor-select">
            <label>Chọn Bác sĩ</label>
            <p className="sub-label">Tìm hiểu thông tin bác sĩ</p>
            {loadingDoctors ? (
              <div>Đang tải danh sách bác sĩ...</div>
            ) : (
              <div className="doctor-list">
                {doctors.map(doctor => (
                  <div
                    key={doctor.doctorId}
                    className={`doctor-card ${formData.doctor?.doctorId === doctor.doctorId ? 'selected' : ''}`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    {/* <img src={doctor.user?.image || 'https://via.placeholder.com/60'} alt={doctor.fullName} className="doctor-avatar" /> */}
                    <span>{doctor.fullName}</span>
                    <div style={{fontSize:'12px',color:'#888'}}>{doctor.specialization}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card-section">
          <div className="form-group consultation-type">
            <label>Hình thức tư vấn</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="consultationType"
                  value="Goi video"
                  checked={formData.consultationType === 'Goi video'}
                  onChange={handleChange}
                />
                Gọi video
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="consultationType"
                  value="Goi"
                  checked={formData.consultationType === 'Goi'}
                  onChange={handleChange}
                />
                Gọi
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="consultationType"
                  value="Tin nhan"
                  checked={formData.consultationType === 'Tin nhan'}
                  onChange={handleChange}
                />
                Tin nhắn
              </label>
            </div>
          </div>

          <div className="form-group description-box">
            <label htmlFor="description">Mô tả về vấn đề bạn cần tư vấn</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Hãy cho tôi biết về vấn đề của bạn"
              rows="5"
            ></textarea>
          </div>
        </div>

        <button type="submit" className="submit-button">Xác nhận đặt lịch</button>
      </form>

      {bookingSuccess && <div className="success-message">Đặt lịch thành công!</div>}
      {bookingError && <div className="error-message">{bookingError}</div>}
    </div>
  );
};

export default BookingPage;