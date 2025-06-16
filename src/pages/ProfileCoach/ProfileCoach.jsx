import React, { useState } from 'react';
import './ProfileCoach.scss';
import apiClient from '../../services/api';

const ProfileCoach = () => {
  const [showChat, setShowChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);


  
  return (
    <div className="profile-coach-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img src="https://images2.thanhnien.vn/528068263637045248/2023/5/27/john-wick-16851763995361259524053.jpg" alt="Coach Profile" className="profile-image" />
        </div>
        <div className="profile-info">
          <h1 className="coach-name">TS. Nguyễn Văn A</h1>
          <p className="coach-detail">Area of expertise: <span className="highlight">cai Nghiện Thuốc Lá</span></p>
          <p className="coach-detail">Working unit: <span className="highlight">Tư nhân</span></p>
          <p className="coach-detail">Experiences: <span className="highlight">100 năm</span></p>
          <p className="coach-detail">Field: <span className="highlight">Hành vi nghiện thuốc</span></p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
          <button className="book-button">Book </button>
          
        </div>
      </div>

      <div className="profile-description">
        <p>I am Nguyen Van A, currently a coach supporting smoking cessation with the desire to accompany you on the journey to regain health and quality of life. With professional knowledge and practical experience from those who have overcome nicotine temptation, I am committed to bringing you a clear, suitable and inspiring roadmap. Quitting smoking is not just about quitting a bad habit, but also the beginning of a new life. I believe that as long as you are determined, I will always be here to support, listen and help you reach the same goal.</p>
        <p>Let's start this journey together - for health, for loved ones, and for yourself!</p>
      </div>

      <div className="suggested-coaches-section">
        <h2 className="suggested-heading">Gợi ý bác sĩ</h2>
        <div className="suggested-coaches-grid">
          <div className="coach-card">
            <img src="https://via.placeholder.com/200" alt="Suggested Coach" className="coach-image"/>
            <h3 className="coach-name">TS. Nguyễn Văn A</h3>
            <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
            <div className="coach-rating">
              <span>★☆☆☆☆</span> <span>1/5</span>
            </div>
          </div>
           <div className="coach-card">
            <img src="https://via.placeholder.com/200" alt="Suggested Coach" className="coach-image"/>
            <h3 className="coach-name">TS. Nguyễn Văn A</h3>
            <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
            <div className="coach-rating">
              <span>★☆☆☆☆</span> <span>1/5</span>
            </div>
          </div>
           <div className="coach-card">
            <img src="https://via.placeholder.com/200" alt="Suggested Coach" className="coach-image"/>
            <h3 className="coach-name">TS. Nguyễn Văn A</h3>
            <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
            <div className="coach-rating">
              <span>★☆☆☆☆</span> <span>1/5</span>
            </div>
          </div>
           <div className="coach-card">
            <img src="https://via.placeholder.com/200" alt="Suggested Coach" className="coach-image"/>
            <h3 className="coach-name">TS. Nguyễn Văn A</h3>
            <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
            <div className="coach-rating">
              <span>★☆☆☆☆</span> <span>1/5</span>
            </div>
          </div>
        </div>
        <button className="more-button">More</button>
      </div>

      {showChat && sessionId && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Chat with Coach</span>
            <button onClick={handleCloseChat}>X</button>
          </div>
          <div className="chat-body">
            <p>Chào bạn, tôi có thể giúp gì cho bạn?</p>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Nhập tin nhắn..." />
            <button>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCoach;
