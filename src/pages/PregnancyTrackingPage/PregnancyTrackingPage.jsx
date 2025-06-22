import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PregnancyTrackingPage.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
// import your API service here, e.g., import pregnancyTrackingService from '../../services/pregnancyTrackingService';

const PregnancyTrackingPage = ({ pregnancyId, onClose }) => {
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
    pregnancyId: pregnancyId ? String(pregnancyId) : '',
    trackingDate: null,
    weekNumber: '',
    weight: '',
    bellySize: '',
    bloodPressure: '',
  });
  useEffect(() => {
    if (pregnancyId) {
      setFormData(prev => ({ ...prev, pregnancyId: String(pregnancyId) }));
    }
  }, [pregnancyId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      trackingDate: date
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
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
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        alert('Thông tin theo dõi thai kỳ đã được thêm thành công!');
        navigate('/baby-checkups-form'); // Chuyển đến trang khám thai nhi
      }
    } catch (error) {
      console.error('Lỗi khi thêm thông tin theo dõi thai kỳ:', error);
      alert('Thêm thông tin theo dõi thai kỳ thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pregnancy-tracking-section">
      <div className="form-container">
        <h2>Theo Dõi Sức Khỏe Thai Kỳ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pregnancyId">Hành trình mang thai:</label>
            <select
              id="pregnancyId"
              name="pregnancyId"
              value={formData.pregnancyId}
              onChange={handleChange}
              required
              disabled={!!pregnancyId}
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
            <label htmlFor="trackingDate">Ngày ghi chú:</label>
            <DatePicker
              selected={formData.trackingDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày ghi chú"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weekNumber">Ngày thai tương ứng:</label>
            <input
              type="number"
              id="weekNumber"
              name="weekNumber"
              value={formData.weekNumber}
              onChange={handleChange}
              placeholder="Nhập ngày thai (ví dụ: 84)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Cân nặng của mẹ (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Nhập cân nặng (ví dụ: 55.5)"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bellySize">Vòng bụng (cm):</label>
            <input
              type="number"
              id="bellySize"
              name="bellySize"
              value={formData.bellySize}
              onChange={handleChange}
              placeholder="Nhập vòng bụng (ví dụ: 80)"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bloodPressure">Huyết áp:</label>
            <input
              type="text"
              id="bloodPressure"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              placeholder="Nhập huyết áp (ví dụ: 120/80)"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu Theo Dõi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PregnancyTrackingPage; 