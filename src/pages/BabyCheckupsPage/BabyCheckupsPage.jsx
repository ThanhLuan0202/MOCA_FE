import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BabyCheckupsPage.scss';

const BabyCheckupsPage = () => {
  const navigate = useNavigate();
  const [userPregnancies, setUserPregnancies] = useState([]);
  useEffect(() => {
    axios.get('https://moca.mom:2030/api/UserPregnancies', { withCredentials: true })
      .then(res => {
        const values = res.data?.$values || [];
        setUserPregnancies(values);
      })
      .catch(() => setUserPregnancies([]));
  }, []);
  const [formData, setFormData] = useState({
    pregnancyId: '',
    checkupDate: null,
    fetalHeartRate: '',
    estimatedWeight: '',
    amnioticFluidIndex: '',
    placentaPosition: '',
    doctorComment: '',
    ultrasoundImage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      checkupDate: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        alert('Thông tin khám thai nhi đã được thêm thành công!');
        navigate('/pregnancy-diary'); // Chuyển đến trang Nhật ký thai kỳ
      }
    } catch (error) {
      console.error('Lỗi khi thêm thông tin khám thai nhi:', error);
      alert('Thêm thông tin khám thai nhi thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="baby-checkups-section">
      <div className="form-container">
        <h2>Thêm Thông Tin Khám Thai Nhi</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pregnancyId">Hành trình mang thai:</label>
            <select
              id="pregnancyId"
              name="pregnancyId"
              value={formData.pregnancyId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn hành trình --</option>
              {userPregnancies.map(p => (
                <option key={p.pregnancyId} value={p.pregnancyId}>
                  {new Date(p.startDate).toLocaleDateString()} - {new Date(p.dueDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="checkupDate">Ngày khám thai:</label>
            <DatePicker
              selected={formData.checkupDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày khám"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fetalHeartRate">Nhịp tim thai (bpm):</label>
            <input
              type="number"
              id="fetalHeartRate"
              name="fetalHeartRate"
              value={formData.fetalHeartRate}
              onChange={handleChange}
              placeholder="Nhập nhịp tim thai (110-160)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedWeight">Ước lượng cân nặng thai nhi (kg):</label>
            <input
              type="number"
              id="estimatedWeight"
              name="estimatedWeight"
              value={formData.estimatedWeight}
              onChange={handleChange}
              placeholder="Nhập cân nặng (ví dụ: 0.35 = 350g)"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amnioticFluidIndex">Chỉ số nước ối (cm):</label>
            <input
              type="number"
              id="amnioticFluidIndex"
              name="amnioticFluidIndex"
              value={formData.amnioticFluidIndex}
              onChange={handleChange}
              placeholder="Nhập chỉ số nước ối (8-18)"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="placentaPosition">Vị trí nhau thai:</label>
            <input
              type="text"
              id="placentaPosition"
              name="placentaPosition"
              value={formData.placentaPosition}
              onChange={handleChange}
              placeholder="Nhập vị trí nhau thai"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="doctorComment">Ghi chú của bác sĩ:</label>
            <textarea
              id="doctorComment"
              name="doctorComment"
              value={formData.doctorComment}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập ghi chú của bác sĩ..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="ultrasoundImage">Link ảnh siêu âm:</label>
            <input
              type="text"
              id="ultrasoundImage"
              name="ultrasoundImage"
              value={formData.ultrasoundImage}
              onChange={handleChange}
              placeholder="Dán link ảnh siêu âm"
            />
          </div>

          <button type="submit" className="submit-button">Lưu Khám Thai Nhi</button>
        </form>
      </div>
    </div>
  );
};

export default BabyCheckupsPage; 