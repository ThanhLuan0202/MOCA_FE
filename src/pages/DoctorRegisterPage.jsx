import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './DoctorRegisterPage.scss';
import { useAuth } from '../contexts/AuthContext';

const DoctorRegisterPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    specialization: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await apiClient.post('/api/DoctorProfile', form);
      setSuccess('Thông tin của bạn đã được ghi nhận! Vui lòng kiểm tra email để hoàn tất đăng ký tài khoản bác sĩ.');
      setForm({ fullName: '', specialization: '', description: '' });
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-register-container">
      <form className="doctor-register-form" onSubmit={handleSubmit}>
        <h1>Đăng ký bác sĩ</h1>
        <p>Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký bác sĩ.</p>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Họ và tên</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Họ và tên" />
        </div>
        <div className="form-group">
          <label>Chuyên môn</label>
          <input name="specialization" value={form.specialization} onChange={handleChange} required placeholder="Chuyên môn" />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Mô tả về bản thân, kinh nghiệm, ..." rows={4} />
        </div>
        <button type="submit" className="register-button" disabled={loading}>{loading ? 'Đang gửi...' : 'Đăng ký'}</button>
      </form>
    </div>
  );
};

export default DoctorRegisterPage; 