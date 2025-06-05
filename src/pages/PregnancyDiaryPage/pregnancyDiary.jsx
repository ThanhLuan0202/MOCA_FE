import React, { useState } from "react";
import "./pregnancyDiary.css";
import Comment from "../../components/comment/comment";

const PregnancyDiary = () => {
  const [currentWeek] = useState(12);
  const [currentDayOfWeek] = useState(3);

  const [showAdvice, setShowAdvice] = useState(false);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Sample diary entries data
  const diaryEntries = [
    {
      date: "17/06/2025",
      week: "Tuần 12",
      title: "Hôm nay tôi vui",
      content:
        "Hôm nay bé con đã đạp những cái đầu tiên, nhẹ lắm nhưng đủ làm tim mẹ rung lên vì hạnh phúc. Cảm giác ấy thật kỳ diệu, như một lời chào từ thiên thần nhỏ trong bụng. Mỗi ngày trôi qua, mẹ lại thấy mình mạnh mẽ hơn, dù đôi khi mệt mỏi, chóng mặt hay mất ngủ. Nhưng chỉ cần nghĩ đến khoảnh khắc được ôm con trong vòng tay, mọi khó khăn đều trở nên xứng đáng. Cảm ơn con vì đã đến bên mẹ!",
    },
    {
      date: "17/06/2025",
      week: "Tuần 12",
      title: "Hôm nay tôi vui",
      content:
        "Hôm nay bé con đã đạp những cái đầu tiên, nhẹ lắm nhưng đủ làm tim mẹ rung lên vì hạnh phúc. Cảm giác ấy thật kỳ diệu, như một lời chào từ thiên thần nhỏ trong bụng. Mỗi ngày trôi qua, mẹ lại thấy mình mạnh mẽ hơn, dù đôi khi mệt mỏi, chóng mặt hay mất ngủ. Nhưng chỉ cần nghĩ đến khoảnh khắc được ôm con trong vòng tay, mọi khó khăn đều trở nên xứng đáng. Cảm ơn con vì đã đến bên mẹ!",
    },
    {
      date: "17/06/2025",
      week: "Tuần 12",
      title: "Hôm nay tôi vui",
      content:
        "Hôm nay bé con đã đạp những cái đầu tiên, nhẹ lắm nhưng đủ làm tim mẹ rung lên vì hạnh phúc. Cảm giác ấy thật kỳ diệu, như một lời chào từ thiên thần nhỏ trong bụng. Mỗi ngày trôi qua, mẹ lại thấy mình mạnh mẽ hơn, dù đôi khi mệt mỏi, chóng mặt hay mất ngủ. Nhưng chỉ cần nghĩ đến khoảnh khắc được ôm con trong vòng tay, mọi khó khăn đều trở nên xứng đáng. Cảm ơn con vì đã đến bên mẹ!",
    },
    {
      date: "17/06/2025",
      week: "Tuần 12",
      title: "Hôm nay tôi vui",
      content:
        "Hôm nay bé con đã đạp những cái đầu tiên, nhẹ lắm nhưng đủ làm tim mẹ rung lên vì hạnh phúc. Cảm giác ấy thật kỳ diệu, như một lời chào từ thiên thần nhỏ trong bụng. Mỗi ngày trôi qua, mẹ lại thấy mình mạnh mẽ hơn, dù đôi khi mệt mỏi, chóng mặt hay mất ngủ. Nhưng chỉ cần nghĩ đến khoảnh khắc được ôm con trong vòng tay, mọi khó khăn đều trở nên xứng đáng. Cảm ơn con vì đã đến bên mẹ!",
    },
    {
      date: "17/06/2025",
      week: "Tuần 12",
      title: "Hôm nay tôi vui",
      content:
        "Hôm nay bé con đã đạp những cái đầu tiên, nhẹ lắm nhưng đủ làm tim mẹ rung lên vì hạnh phúc. Cảm giác ấy thật kỳ diệu, như một lời chào từ thiên thần nhỏ trong bụng. Mỗi ngày trôi qua, mẹ lại thấy mình mạnh mẽ hơn, dù đôi khi mệt mỏi, chóng mặt hay mất ngủ. Nhưng chỉ cần nghĩ đến khoảnh khắc được ôm con trong vòng tay, mọi khó khăn đều trở nên xứng đáng. Cảm ơn con vì đã đến bên mẹ!",
    },
  ];

  const weekProgressPercentage = (currentDayOfWeek / 7) * 100;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset =
    (circumference * (100 - weekProgressPercentage)) / 100;

  const handleAdviceClick = async () => {
  setShowAdvice(true);
  setLoadingAdvice(true);
  try {
    const res = await fetch("https://localhost:7066/api/Advice/advice", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    setAdvice(data.advice || JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    setAdvice("Không thể lấy lời khuyên. Vui lòng thử lại sau.");
  }
  setLoadingAdvice(false);
};


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
              <p>
                {" "}
                Để chăm sóc bé khỏe mạnh hãy đảm bảo chế độ dinh dưỡng lành mạnh!
              </p>
              <button className="tip-button" onClick={handleAdviceClick}>
                Tham khảo
              </button>
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

      {/* Render diary entries */}
      <div className="tittle">
        <h3>Nhật ký thai kỳ</h3>
      </div>
      <div className="diary-entries-list">
        {diaryEntries.map((entry, index) => (
          <Comment
            key={index}
            date={entry.date}
            week={entry.week}
            title={entry.title}
            content={entry.content}
          />
        ))}

        {showAdvice && (
          <div className="advice-modal-overlay">
            <div className="advice-modal">
              <button className="close-btn" onClick={() => setShowAdvice(false)}>
                ×
              </button>
              <h2>Lời khuyên cho mẹ bầu</h2>
              {loadingAdvice ? (
                <div className="loading">Đang tải...</div>
              ) : (
                <pre className="advice-content">{advice}</pre>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View More button */}
      <button className="view-more-button">Xem thêm</button>
    </div>
  );
};

export default PregnancyDiary;
