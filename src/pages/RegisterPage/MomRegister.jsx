import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MomRegister.scss';

const MomRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    address: '',
    maritalStatus: '',
    bloodType: '',
    medicalHistory: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format data according to API requirements
    const apiData = {
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      maritalStatus: formData.maritalStatus,
      bloodType: formData.bloodType,
      medicalHistory: formData.medicalHistory
    };

    try {
      const response = await axios.post('https://moca.mom:2030/api/MomProfile', apiData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.status === 200) {
        alert('Đăng ký thành công!');
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="mom-register">
      <h1 className="page-title">Đăng ký thông tin Mẹ bầu</h1>
      <div className="register-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Ngày sinh:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maritalStatus">Tình trạng hôn nhân:</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                required
              >
                <option value="">Chọn tình trạng hôn nhân</option>
                <option value="Chưa kết hôn">Chưa kết hôn</option>
                <option value="Sắp kết hôn">Sắp kết hôn</option>
                <option value="Đã kết hôn">Đã kết hôn</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bloodType">Nhóm máu:</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
              >
                <option value="">Chọn nhóm máu</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="medicalHistory">Tiền sử bệnh lý:</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập tiền sử bệnh lý của bạn (nếu có)"
            />
          </div>

          <button type="submit" className="submit-button">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default MomRegister;