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
    service: '',
    doctor: null,
    consultationType: 'Tin nhan', // Default to 'Tin nhan'
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

    // Validate
    if (!formData.doctor || !formData.date || !formData.time) {
      setBookingError('Vui lòng chọn bác sĩ, ngày và giờ!');
      setIsSubmitting(false);
      return;
    }

    // Ghép ngày và giờ thành bookingDate ISO
    const bookingDate = new Date(`${formData.date}T${formData.time}:00`);
    
    // Map consultationType về số theo yêu cầu
    let consultationType = 0;
    if (formData.consultationType === 'Tin nhan') consultationType = 1;
    else if (formData.consultationType === 'Goi') consultationType = 2;
    else if (formData.consultationType === 'Goi video') consultationType = 3;

    // Gửi booking với API Azure
    try {
      const bookingData = {
        doctorId: formData.doctor.doctorId,
        bookingDate: bookingDate.toISOString(),
        consultationType: consultationType,
        requiredDeposit: 50000, // Mặc định 50000
        notes: formData.description || '',
        price: 150000 // Mặc định 150000
      };

      console.log('Sending booking data:', bookingData);
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('authToken');
      // Gọi trực tiếp API Azure cho booking, gửi kèm Authorization header
      const response = await axios.post(
        'https://moca-d8fxfqgdb4hxg5ha.southeastasia-01.azurewebsites.net/api/DoctorBooking',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Booking response:', response.data);

      if (response.data && response.data.paymentUrl) {
        // Chuyển hướng đến PayPal
        window.location.href = response.data.paymentUrl;
      } else {
        setBookingSuccess(true);
        setBookingError('');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('Đặt lịch thất bại! Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
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
              <option value="tu-van-thai-ky">Tư vấn thai kỳ</option>
              <option value="kham-thai">Khám thai</option>
            </select>
          </div>

          <div className="form-group doctor-select">
            <label>Chọn Bác sĩ</label>
            <button type="button" className="sub-label" style={{background:'none',border:'none',color:'#6a5af9',cursor:'pointer',padding:0,marginBottom:8}} disabled={!formData.doctor} onClick={() => handleShowDoctorModal(formData.doctor)}>
              Chi tiết bác sĩ
            </button>
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
                  value="Tin nhan"
                  checked={formData.consultationType === 'Tin nhan'}
                  onChange={handleChange}
                />
                Tin nhắn
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
                  value="Goi video"
                  checked={formData.consultationType === 'Goi video'}
                  onChange={handleChange}
                />
                Gọi video
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

          <div className="form-group pricing-info">
            <label>Thông tin thanh toán</label>
            <div className="pricing-details">
              <p><strong>Phí tư vấn:</strong> 150,000 VNĐ</p>
              <p><strong>Đặt cọc:</strong> 50,000 VNĐ</p>
              <p><strong>Tổng cộng:</strong> 200,000 VNĐ</p>
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