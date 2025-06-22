import React, { useEffect, useState } from 'react';
import apiClient from '../../../../services/api';
import './User.scss';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/api/User'); // Đổi endpoint nếu cần
        setUsers(response.$values || []);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách user!');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="user-loading">Đang tải danh sách user...</div>;
  if (error) return <div className="user-error">{error}</div>;

  return (
    <div className="user-list-container">
      <h2>Danh sách User</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.fullName || 'N/A'}</td>
              <td>{user.email || 'N/A'}</td>
              <td>{user.roleName || user.roleId || 'N/A'}</td>
              <td>{user.phoneNumber  || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;