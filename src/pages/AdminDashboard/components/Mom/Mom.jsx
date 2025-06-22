import React, { useEffect, useState } from 'react';
import apiClient from '../../../../services/api';
import './Mom.scss';

const Mom = () => {
  const [moms, setMoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoms = async () => {
      try {
        const response = await apiClient.get('/api/MomProfile'); // Đổi endpoint nếu cần
        setMoms(response.$values || response || []);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách Mom!');
        setLoading(false);
      }
    };
    fetchMoms();
  }, []);

  if (loading) return <div className="mom-loading">Đang tải danh sách Mom...</div>;
  if (error) return <div className="mom-error">{error}</div>;

  return (
    <div className="mom-list-container">
      <h2>Danh sách Mom</h2>
      <table className="mom-table">
        <thead>
          <tr>
            <th>Mom ID</th>
            <th>User ID</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Tình trạng hôn nhân</th>
            <th>Nhóm máu</th>
            <th>Tiền sử bệnh</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {moms.map(mom => (
            <tr key={mom.momId}>
              <td>{mom.momId}</td>
              <td>{mom.userId}</td>
              <td>{mom.dateOfBirth ? new Date(mom.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}</td>
              <td>{mom.address || 'N/A'}</td>
              <td>{mom.maritalStatus || 'N/A'}</td>
              <td>{mom.bloodType || 'N/A'}</td>
              <td>{mom.medicalHistory || 'N/A'}</td>
              <td>{mom.user ? mom.user.fullName : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mom;