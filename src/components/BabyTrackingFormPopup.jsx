import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TrackingFormPopup.scss';

const BabyTrackingFormPopup = ({ pregnancyId, onClose }) => {
  const [formData, setFormData] = useState({
    pregnancyId: pregnancyId ? String(pregnancyId) : '',
    checkupDate: null,
    fetalHeartRate: '',
    estimatedWeight: '',
    amnioticFluidIndex: '',
    placentaPosition: '',
    doctorComment: '',
    ultrasoundImage: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, checkupDate: date }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiData = {
      pregnancyId: parseInt(formData.pregnancyId),
      checkupDate: formData.checkupDate ? formData.checkupDate.toISOString().split('T')[0] : null,
      fetalHeartRate: parseInt(formData.fetalHeartRate),
      estimatedWeight: parseFloat(formData.estimatedWeight),
      amnioticFluidIndex: parseFloat(formData.amnioticFluidIndex),
      placentaPosition: formData.placentaPosition,
      doctorComment: formData.doctorComment,
      ultrasoundImage: formData.ultrasoundImage,
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await axios.post('https://moca.mom:2030/api/BabayTracking', apiData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.status === 200) {
        alert('Thêm thông tin theo dõi thai nhi thành công!');
        if (onClose) onClose();
      }
    } catch (error) {
      alert('Thêm thông tin theo dõi thai nhi thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="tracking-form-popup" onSubmit={handleSubmit}>
      {/* Trường pregnancyId đã truyền sẵn, không hiển thị */}
      <div style={{ display: 'none' }}>
        <input type="text" value={formData.pregnancyId} readOnly />
      </div>
      <div className="form-group">
        <label>Ngày khám thai:</label>
        <DatePicker
          selected={formData.checkupDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày khám"
          required
        />
      </div>
      <div className="form-group">
        <label>Nhịp tim thai (bpm):</label>
        <input
          type="number"
          name="fetalHeartRate"
          value={formData.fetalHeartRate}
          onChange={handleChange}
          placeholder="Nhập nhịp tim thai (110-160)"
          required
        />
      </div>
      <div className="form-group">
        <label>Ước lượng cân nặng thai nhi (kg):</label>
        <input
          type="number"
          name="estimatedWeight"
          value={formData.estimatedWeight}
          onChange={handleChange}
          placeholder="Nhập cân nặng (ví dụ: 0.35 = 350g)"
          step="0.01"
          required
        />
      </div>
      <div className="form-group">
        <label>Chỉ số nước ối (cm):</label>
        <input
          type="number"
          name="amnioticFluidIndex"
          value={formData.amnioticFluidIndex}
          onChange={handleChange}
          placeholder="Nhập chỉ số nước ối (8-18)"
          step="0.1"
          required
        />
      </div>
      <div className="form-group">
        <label>Vị trí nhau thai:</label>
        <input
          type="text"
          name="placentaPosition"
          value={formData.placentaPosition}
          onChange={handleChange}
          placeholder="Nhập vị trí nhau thai"
          required
        />
      </div>
      <div className="form-group">
        <label>Ghi chú của bác sĩ:</label>
        <textarea
          name="doctorComment"
          value={formData.doctorComment}
          onChange={handleChange}
          rows="3"
          placeholder="Nhập ghi chú của bác sĩ..."
        />
      </div>
      <div className="form-group">
        <label>Link ảnh siêu âm:</label>
        <input
          type="text"
          name="ultrasoundImage"
          value={formData.ultrasoundImage}
          onChange={handleChange}
          placeholder="Dán link ảnh siêu âm"
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

export default BabyTrackingFormPopup; 