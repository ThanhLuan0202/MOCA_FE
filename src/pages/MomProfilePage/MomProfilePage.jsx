import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MomProfilePage.scss';
import { FaBirthdayCake, FaMapMarkerAlt, FaHeart, FaTint, FaNotesMedical } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const MomProfilePage = () => {
  const [momProfile, setMomProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMomProfile = async () => {
      try {
        // Lấy userId từ query string nếu có, nếu không thì lấy userId mặc định (user đăng nhập)
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId') || 2;
        const response = await axios.get(`https://moca.mom:2030/api/MomProfile/GetUserById?userId=${userId}`, {
          withCredentials: true,
        });
        setMomProfile(response.data);
      } catch (err) {
        console.error('Lỗi khi tải thông tin Mom Profile:', err);
        setError('Không thể tải thông tin mẹ bầu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchMomProfile();
  }, [location.search]);

  if (loading) {
    return <div className="mom-profile-section">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="mom-profile-section error-message">{error}</div>;
  }

  if (!momProfile) {
    return <div className="mom-profile-section no-data">Không tìm thấy thông tin mẹ bầu.</div>;
  }

  const handleManagePregnancy = () => {
    navigate('/user-pregnancy-form'); // Chuyển đến trang quản lý thai kỳ
  };

  return (
    <div className="mom-profile-section">
      <div className="mom-profile-card">
        <h2 className="profile-title">Thông tin Mẹ bầu</h2>
        <div className="profile-info-grid">
          <div className="info-item">
            <FaBirthdayCake className="icon" />
            <span>Ngày sinh:</span>
            <p style={{ marginLeft: 8, display: 'inline' }}>{momProfile.dateOfBirth}</p>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <span>Địa chỉ:</span>
            <p style={{ marginLeft: 8, display: 'inline' }}>{momProfile.address}</p>
          </div>
          <div className="info-item">
            <FaHeart className="icon" />
            <span>Tình trạng hôn nhân:</span>
            <p style={{ marginLeft: 8, display: 'inline' }}>{momProfile.maritalStatus}</p>
          </div>
          <div className="info-item">
            <FaTint className="icon" />
            <span>Nhóm máu:</span>
            <p style={{ marginLeft: 8, display: 'inline' }}>{momProfile.bloodType}</p>
          </div>
          <div className="info-item full-width">
            <FaNotesMedical className="icon" />
            <span>Tiền sử bệnh lý:</span>
            <p style={{ marginLeft: 8, display: 'inline' }}>{momProfile.medicalHistory || "Không có"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomProfilePage; 