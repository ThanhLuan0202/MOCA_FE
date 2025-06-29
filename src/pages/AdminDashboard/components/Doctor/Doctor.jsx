import React, { useEffect, useState } from 'react';
import apiClient from '../../../../services/api';
import './Doctor.scss';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // You might need to change this endpoint to match your API
        const response = await apiClient.get('/api/DoctorProfile'); 
        setDoctors(response.$values || response || []);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách bác sĩ!');
        console.error(err);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleConfirmDoctor = async (doctorId) => {
    try {
      await apiClient.post(
        'https://moca.mom:2030/api/DoctorProfile/ConfirmDoctor',
        doctorId, // body là số, không phải object
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Sau khi xác nhận, reload lại danh sách bác sĩ
      const response = await apiClient.get('/api/DoctorProfile');
      setDoctors(response.$values || response || []);
      alert('Xác nhận thành công!');
    } catch (err) {
      alert('Xác nhận thất bại!');
      console.error(err);
    }
  };

  if (loading) return <div className="doctor-loading">Đang tải danh sách bác sĩ...</div>;
  if (error) return <div className="doctor-error">{error}</div>;

  return (
    <div className="doctor-list-container">
      <h2>Danh sách Bác sĩ</h2>
      <table className="doctor-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Doctor ID</th>
            <th>Họ và tên</th>
            <th>Chuyên ngành</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            {/* <th>Bookings</th> */}
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.doctorId}>
              <td>{doctor.userId}</td>
              <td>{doctor.doctorId}</td>
              <td>{doctor.fullName || 'N/A'}</td>
              <td>{doctor.specialization || 'N/A'}</td>
              <td>{doctor.description || 'N/A'}</td>
              <td>
                {doctor.status && doctor.status.toLowerCase() === 'active' && (
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>Đang hoạt động</span>
                )}
                {doctor.status && doctor.status.toLowerCase() === 'pending' && (
                  <>
                    <span style={{ color: '#f59e42', fontWeight: 600, marginRight: 8 }}>Đang chờ xử lý</span>
                    <button
                      style={{ padding: '6px 16px', background: '#6a5af9', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}
                      onClick={() => handleConfirmDoctor(doctor.doctorId)}
                    >
                      Xác nhận
                    </button>
                  </>
                )}
                {doctor.status && !['active', 'pending'].includes(doctor.status.toLowerCase()) && (
                  <span>{doctor.status || 'N/A'}</span>
                )}
              </td>
              {/* <td>{doctor.doctorBookings ? doctor.doctorBookings.length : 0}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctor;