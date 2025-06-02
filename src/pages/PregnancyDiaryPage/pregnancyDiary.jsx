import React, { useState } from 'react';
import './pregnancyDiary.css'; 

const PregnancyDiary = () => {
 
  const [currentWeek, setCurrentWeek] = useState(12); 
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState(3); 



  const weekProgressPercentage = (currentDayOfWeek / 7) * 100;

  const radius = 100; 
  const circumference = 2 * Math.PI * radius; 


  const strokeDashoffset = circumference * (100 - weekProgressPercentage) / 100;

  return (
    <div className="pregnancy-diary-page">

      <div className="top-section">

        <div className="left-column">

          <div className="month-nav">
            <span className="arrow">←</span>
            <span className="month">Tháng 8</span>
            <span className="arrow">→</span>
          </div>

          <div className="event-list">
            <div className="event-item">
              <span className="date">12/8</span>
              <span className="title">Khám thai kỳ</span>
            </div>
            <div className="event-item">
              <span className="date">21/8</span>
              <span className="title">Gặp chuyên gia</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-button">Thêm lịch</button>
            <button className="edit-button">Chỉnh sửa</button>
          </div>


          <div className="user-info">
            <div className="user-name">Nguyen Thanh Luan</div>
            <div className="user-details">
              <p>Dự sinh: 12/12/2025</p>
              <p>Chiều cao ước tính: 14.2cm</p>
              <p>Cân nặng ước tính: 190g</p>
            </div>
            <button className="edit-profile-button">Chỉnh sửa</button>
          </div>
        </div>


        <div className="right-column">
          <div className="pregnancy-progress">

            <svg className="progress-circle-svg" viewBox="0 0 240 240">

              <circle
                className="progress-circle-background"
                cx="120"
                cy="120"
                r={radius}
              />

              <circle
                className="progress-circle-progress"
                cx="120"
                cy="120"
                r={radius}
                transform="rotate(-90 120 120)"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>

            <div className="progress-text">
              <div className="weeks">{currentWeek} tuần</div>
              <div className="days">{currentDayOfWeek} ngày</div>
            </div>

            <div className="tip-box">
              <p> Để chăm sóc bé khỏe mạnh hãy đảm bảo chế độ dinh dưỡng lành mạnh!</p>
              <button className="tip-button">Tham khảo</button>
            </div>
          </div>
        </div>
      </div>


      <div className="bottom-section">
        <div className="feelings-title">Bạn đang cảm thấy như thế nào ?</div>
        <div className="feeling-options">
          <div className="feeling-box">
            <div className="feeling-text">Need to Boost</div>
            <div className="feeling-description">Tôi gặp vấn đề</div>
          </div>
          <div className="feeling-box">
            <div className="feeling-text">Need to Focus</div>
            <div className="feeling-description">Tôi cảm thấy ổn</div>
          </div>
          <div className="feeling-box">
            <div className="feeling-text">Need to Rest</div>
            <div className="feeling-description">Tôi cảm thấy thoải mái</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyDiary; 