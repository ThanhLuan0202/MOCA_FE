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
              <td>{doctor.status || 'N/A'}</td>
              {/* <td>{doctor.doctorBookings ? doctor.doctorBookings.length : 0}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctor;