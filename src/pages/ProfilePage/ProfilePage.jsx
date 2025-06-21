import React, { useEffect, useState } from "react";
import apiClient from "../../services/api";
import authService from '../../services/auth'; // Import authService
import "./ProfilePage.scss"; // Tạo file này để chứa CSS đẹp

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  // Define role mapping
  const roleMap = {
    1: 'Admin',
    2: 'Manager',
    3: 'Mom',
    4: 'Doctor',
    5: 'User',
    6: 'Guest',
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const { userId } = authService.getUserInfoFromToken(token);
      if (userId) {
        apiClient
          .get(`/api/User/${userId}`)
          .then((response) => {
            setUser(response);
          })
          .catch((err) => console.error("Lỗi lấy user:", err));
      } else {
        console.error("Không lấy được UserId từ token.");
        // Optionally handle the case where userId cannot be extracted
      }
    } else {
      console.log("Không có token, người dùng chưa đăng nhập.");
      // Optionally redirect to login or show a message
    }
  }, []);

  if (!user) return <div className="profile-section">Loading...</div>;

  return (
    <div>
      <div className="profile-section">
        <div className="profile-card">
          <img src={user.image} alt="avatar" className="profile-avatar" />
          <h2 className="profile-name">{user.fullName}</h2>
          <p className="profile-username">{roleMap[user.roleId] || 'N/A'}</p>
          <div className="profile-info">
            <div>
              <span>
                Email:<p>{user.email}</p>
              </span>
            </div>
            {/* <div>
              <span>
                Birth date:<p>{user.birth_date}</p>
              </span>
            </div> */}
            <div>
              <span>
                PhoneNumber: <p>{user.phoneNumber}</p>
              </span>
            </div>
            
            {/* <div>
              <span>
                Joined:
                <p>
                  {user.createdAt || user.createDate
                    ? new Date(user.createdAt || user.createDate).toLocaleDateString()
                    : "N/A"
                  }
                </p>
              </span>
            </div> */}
          </div>
          <button className="profile-edit-btn">Edit Profile</button>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
