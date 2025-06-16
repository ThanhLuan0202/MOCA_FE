import React, { useEffect, useState } from "react";
import apiClient from "../../services/api";
import "./ProfilePage.scss"; // Tạo file này để chứa CSS đẹp

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Giả sử userId là "1", bạn có thể lấy từ localStorage hoặc context nếu có đăng nhập
    const userId = "1";
    apiClient
      .get(`/users/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => console.error("Lỗi lấy user:", err));
  }, []);

  if (!user) return <div className="profile-section">Loading...</div>;

  return (
    <div>
      <div className="profile-section">
        <div className="profile-card">
          <img src={user.avatar} alt="avatar" className="profile-avatar" />
          <h2 className="profile-name">{user.full_name}</h2>
          <p className="profile-username">@{user.username}</p>
          <div className="profile-info">
            <div>
              <span>
                Email:<p>{user.email}</p>
              </span>
            </div>
            <div>
              <span>
                Birth date:<p>{user.birth_date}</p>
              </span>
            </div>
            <div>
              <span>
                Gender: <p>{user.gender}</p>
              </span>
            </div>
            <div>
              <span>
                Role: <p>{user.role}</p>
              </span>
            </div>
            <div>
              <span>
                Joined: <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </span>{" "}
            </div>
          </div>
          <button className="profile-edit-btn">Edit Profile</button>
        </div>
      </div>
      
    </div>
  );
};

export default ProfilePage;
