import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserPregnancyFormPage.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserPregnancyFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: null,
    dueDate: null,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: date
    }));
  };

  const calculateDueDate = (startDate) => {
    if (!startDate) return null;
    const date = new Date(startDate);
    date.setDate(date.getDate() + 280); // Add 280 days (40 weeks) for due date calculation
    return date;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tự động tính dueDate nếu startDate có
    const finalDueDate = formData.dueDate || calculateDueDate(formData.startDate);

    const apiData = {
      startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : null,
      dueDate: finalDueDate ? finalDueDate.toISOString().split('T')[0] : null,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post('https://moca.mom:2030/api/UserPregnancies', apiData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.status === 200) {
        alert('Thông tin thai kỳ đã được thêm thành công!');
        navigate('/pregnancy-tracking-form'); // Chuyển đến trang theo dõi thai kỳ
      }
    } catch (error) {
      console.error('Lỗi khi thêm thông tin thai kỳ:', error);
      alert('Thêm thông tin thai kỳ thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="user-pregnancy-form-section">
      <div className="form-container">
        <h2>Thêm Thông Tin Thai Kỳ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startDate">Ngày đầu kinh cuối (LMP):</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Ngày dự sinh:</label>
            <DatePicker
              selected={formData.dueDate || calculateDueDate(formData.startDate)}
              onChange={(date) => handleDateChange(date, 'dueDate')}
              dateFormat="dd/MM/yyyy"
              placeholderText="Tự động tính hoặc nhập"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Ghi chú (Thai IVF, song thai,...):</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập ghi chú..."
            />
          </div>

          <button type="submit" className="submit-button">Thêm Thai Kỳ</button>
        </form>
      </div>
    </div>
  );
};

export default UserPregnancyFormPage; 