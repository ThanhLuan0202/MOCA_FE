import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TrackingFormPopup.scss';

const TrackingFormPopup = ({ pregnancyId, onClose }) => {
  const [formData, setFormData] = useState({
    pregnancyId: pregnancyId ? String(pregnancyId) : '',
    trackingDate: null,
    weekNumber: '',
    weight: '',
    bellySize: '',
    bloodPressure: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, trackingDate: date }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiData = {
      pregnancyId: parseInt(formData.pregnancyId),
      trackingDate: formData.trackingDate ? formData.trackingDate.toISOString().split('T')[0] : null,
      weekNumber: parseInt(formData.weekNumber),
      weight: parseFloat(formData.weight),
      bellySize: parseFloat(formData.bellySize),
      bloodPressure: formData.bloodPressure,
    };
    try {
      const response = await axios.post('https://moca.mom:2030/api/PregnancyTracking', apiData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.status === 200) {
        alert('Thêm thông tin theo dõi thai kỳ thành công!');
        if (onClose) onClose();
      }
    } catch (error) {
      alert('Thêm thông tin theo dõi thai kỳ thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="tracking-form-popup" onSubmit={handleSubmit}>
      <div style={{ display: 'none' }}>
        <input type="text" value={formData.pregnancyId} readOnly />
      </div>
      <div className="form-group">
        <label>Ngày ghi chú:</label>
        <DatePicker
          selected={formData.trackingDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày ghi chú"
          required
        />
      </div>
      <div className="form-group">
        <label>Ngày thai tương ứng:</label>
        <input
          type="number"
          name="weekNumber"
          value={formData.weekNumber}
          onChange={handleChange}
          placeholder="Nhập ngày thai (ví dụ: 84)"
          required
        />
      </div>
      <div className="form-group">
        <label>Cân nặng của mẹ (kg):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Nhập cân nặng (ví dụ: 55.5)"
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Vòng bụng (cm):</label>
        <input
          type="number"
          name="bellySize"
          value={formData.bellySize}
          onChange={handleChange}
          placeholder="Nhập vòng bụng (ví dụ: 80)"
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Huyết áp:</label>
        <input
          type="text"
          name="bloodPressure"
          value={formData.bloodPressure}
          onChange={handleChange}
          placeholder="Nhập huyết áp (ví dụ: 120/80)"
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onClose}>Huỷ</button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu Theo Dõi'}
        </button>
      </div>
    </form>
  );
};

export default TrackingFormPopup; 