import React, { useState } from 'react';
import './PregnancyTrackingPage.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
// import your API service here, e.g., import pregnancyTrackingService from '../../services/pregnancyTrackingService';

const PregnancyTrackingPage = () => {
  const [formData, setFormData] = useState({
    pregnancyId: '',
    trackingDate: null,
    weight: '',
    bloodPressure: '',
    heartRate: '',
    symptoms: '',
    notes: '',
    nextAppointment: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Basic validation
    if (!formData.pregnancyId || !formData.trackingDate || !formData.weight || !formData.bloodPressure || !formData.heartRate) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      setLoading(false);
      return;
    }

    // Prepare data for API
    const dataToSend = {
      PregnancyID: parseInt(formData.pregnancyId),
      TrackingDate: formData.trackingDate ? formData.trackingDate.toISOString() : null,
      Weight: parseFloat(formData.weight),
      BloodPressure: formData.bloodPressure,
      HeartRate: parseInt(formData.heartRate),
      Symptoms: formData.symptoms,
      Notes: formData.notes,
      NextAppointment: formData.nextAppointment ? formData.nextAppointment.toISOString() : null
    };

    console.log('Submitting Pregnancy Tracking data:', dataToSend);

    try {
      // Replace with your actual API call
      // const response = await pregnancyTrackingService.createTracking(dataToSend);
      
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Simulated API success for Pregnancy Tracking');
      setSuccessMessage('Thông tin theo dõi thai kỳ đã được lưu thành công!');
      setFormData({
        pregnancyId: '',
        trackingDate: null,
        weight: '',
        bloodPressure: '',
        heartRate: '',
        symptoms: '',
        notes: '',
        nextAppointment: null
      });

    } catch (apiError) {
      console.error('Pregnancy Tracking API Error:', apiError);
      setError('Lưu thông tin theo dõi thai kỳ thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pregnancy-tracking-container">
      <div className="pregnancy-tracking-form">
        <h1>Theo dõi thai kỳ</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pregnancyId">Mã thai kỳ</label>
            <input
              type="number"
              id="pregnancyId"
              name="pregnancyId"
              value={formData.pregnancyId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="trackingDate">Ngày theo dõi</label>
            <DatePicker
              selected={formData.trackingDate}
              onChange={(date) => handleDateChange('trackingDate', date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              customInput={<input type="text" id="trackingDate" name="trackingDate" required />}
              showIcon
              icon={<FaCalendarAlt className="icon" />}
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Cân nặng (kg)</label>
            <input
              type="number"
              step="0.1"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bloodPressure">Huyết áp</label>
            <input
              type="text"
              id="bloodPressure"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              placeholder="VD: 120/80"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="heartRate">Nhịp tim (bpm)</label>
            <input
              type="number"
              id="heartRate"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="symptoms">Triệu chứng</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Ghi chú</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="nextAppointment">Lịch hẹn tiếp theo</label>
            <DatePicker
              selected={formData.nextAppointment}
              onChange={(date) => handleDateChange('nextAppointment', date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              customInput={<input type="text" id="nextAppointment" name="nextAppointment" />}
              showIcon
              icon={<FaCalendarAlt className="icon" />}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thông tin theo dõi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PregnancyTrackingPage; 