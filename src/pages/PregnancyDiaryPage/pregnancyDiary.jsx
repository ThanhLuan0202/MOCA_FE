import React, { useState, useEffect } from "react";
import "./pregnancyDiary.css";
import Comment from "../../components/comment/comment";
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const PregnancyDiary = () => {
  const [showAdvice, setShowAdvice] = useState(false);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showDoctorComment, setShowDoctorComment] = useState(false);
  const [doctorCommentDetail, setDoctorCommentDetail] = useState("");

  // State cho dữ liệu API
  const [userPregnancies, setUserPregnancies] = useState([]);
  const [selectedPregnancyId, setSelectedPregnancyId] = useState(null);
  const [allPregnancyTracking, setAllPregnancyTracking] = useState([]);
  const [allBabyTracking, setAllBabyTracking] = useState([]);
  const [loadingPregnancy, setLoadingPregnancy] = useState(true);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [showAllDiaryEntries, setShowAllDiaryEntries] = useState(false);

  // Ánh xạ key sang tiếng Việt
  const fieldLabels = {
    // UserPregnancies
    pregnancyId: 'Mã thai kỳ',
    momId: 'Mã mẹ',
    startDate: 'Ngày bắt đầu',
    dueDate: 'Ngày dự sinh',
    notes: 'Ghi chú',
    createdAt: 'Ngày tạo',
    // PregnancyTracking
    trackingId: 'Mã theo dõi',
    trackingDate: 'Ngày theo dõi',
    weekNumber: 'Tuần thai',
    weight: 'Cân nặng (kg)',
    bellySize: 'Vòng bụng (cm)',
    bloodPressure: 'Huyết áp',
    // BabyTracking
    checkupBabyId: 'Mã khám thai nhi',
    checkupDate: 'Ngày khám',
    fetalHeartRate: 'Nhịp tim thai',
    estimatedWeight: 'Cân nặng ước tính (kg)',
    amnioticFluidIndex: 'Chỉ số nước ối',
    placentaPosition: 'Vị trí nhau thai',
    doctorComment: 'Nhận xét bác sĩ',
    ultrasoundImage: 'Ảnh siêu âm',
  };
  const hiddenFields = ["$id", "$values", "$ref", "babyTrackings", "pregnancyTrackings", "mom", "pregnancy", "user", "userPregnancies", "pregnancyDiaries", "momId", "pregnancyId", "trackingId", "checkupBabyId"];

  const navigate = useNavigate();

  // Lấy danh sách thai kỳ
  useEffect(() => {
    const fetchUserPregnancies = async () => {
      try {
        const data = await apiClient.get("/api/UserPregnancies");
        const pregnancies = data?.$values || [];
        setUserPregnancies(pregnancies);
        if (pregnancies.length > 0) {
          const sorted = pregnancies.slice().sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setSelectedPregnancyId(sorted[0].pregnancyId);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách thai kỳ:", err);
        setUserPregnancies([]);
      }
    };
    fetchUserPregnancies();
  }, []);

  // Lấy toàn bộ tracking mẹ và bé
  useEffect(() => {
    const fetchAllTracking = async () => {
      setLoadingPregnancy(true);
      try {
        const [momTrackingData, babyTrackingData] = await Promise.all([
          apiClient.get("/api/PregnancyTracking"),
          apiClient.get("/api/BabayTracking")
        ]);
        setAllPregnancyTracking(momTrackingData?.$values || []);
        setAllBabyTracking(babyTrackingData?.$values || []);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu tracking:", err);
        setAllPregnancyTracking([]);
        setAllBabyTracking([]);
      }
      setLoadingPregnancy(false);
    };
    fetchAllTracking();
  }, []);

  // Lọc dữ liệu theo pregnancyId đang chọn
  const selectedPregnancy = userPregnancies.find(p => p.pregnancyId === selectedPregnancyId);
  const pregnancyTracking = allPregnancyTracking.filter(t => t.pregnancyId === selectedPregnancyId);
  const babyTracking = allBabyTracking.filter(t => t.pregnancyId === selectedPregnancyId);

  // Lấy weekNumber mới nhất từ pregnancyTracking
  const latestPregTracking = pregnancyTracking.length > 0
    ? pregnancyTracking.reduce((latest, cur) => {
        return new Date(cur.trackingDate || 0) > new Date(latest.trackingDate || 0) ? cur : latest;
      }, pregnancyTracking[0])
    : null;
  const weekNumber = latestPregTracking?.weekNumber || 0;
  const currentWeek = Math.floor(weekNumber / 7);
  const currentDayOfWeek = weekNumber % 7;

  // Helper to get latest tracking values
  const getLatest = (arr, key) => {
    if (!arr || arr.length === 0) return null;
    // Sort by date descending
    return arr.slice().sort((a, b) => new Date(b[key]) - new Date(a[key]))[0];
  };
  const latestBabyTracking = getLatest(babyTracking, "checkupDate");

  // Lấy nhật ký thai kỳ từ API khi vào trang
  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const data = await apiClient.get('/api/PregnancyDiary');
        setDiaryEntries(Array.isArray(data) ? data : (data?.$values || []));
      } catch (err) {
        console.error("Lỗi lấy nhật ký:", err);
        setDiaryEntries([]);
      }
    };
    fetchDiaryEntries();
  }, []);

  const weekProgressPercentage = (currentDayOfWeek / 7) * 100;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset =
    (circumference * (100 - weekProgressPercentage)) / 100;

  const handleAdviceClick = async () => {
    setShowAdvice(true);
    setLoadingAdvice(true);
    try {
      const data = await apiClient.post("/api/Advice/advice");
      console.log(data);
      setAdvice(data.advice || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Lỗi lấy lời khuyên:", err);
      setAdvice("Không thể lấy lời khuyên. Vui lòng thử lại sau.");
    }
    setLoadingAdvice(false);
  };

  // Các trường hiển thị cho bảng tracking mẹ
  const momTrackingFields = [
    { key: 'weekNumber', label: 'Ngày thai' },
    { key: 'weight', label: 'Cân nặng (kg)' },
    { key: 'bellySize', label: 'Vòng bụng (cm)' },
    { key: 'bloodPressure', label: 'Huyết áp' },
  ];
  // Các trường hiển thị cho bảng tracking bé
  const babyTrackingFields = [
    { key: 'fetalHeartRate', label: 'Nhịp tim thai' },
    { key: 'estimatedWeight', label: 'Cân nặng ước tính (kg)' },
    { key: 'amnioticFluidIndex', label: 'Chỉ số nước ối' },
    { key: 'placentaPosition', label: 'Vị trí nhau thai' },
    { key: 'doctorComment', label: 'Nhận xét bác sĩ' },
  ];

  // Thêm hàm formatDate
  function formatDate(dateStr, withTime = true) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const pad = n => n.toString().padStart(2, '0');
    const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    if (!withTime) return date;
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return `${date} ${time}`;
  }

  // Thêm hàm handleFeelingClick
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [pendingFeeling, setPendingFeeling] = useState("");
  const [feelingTitle, setFeelingTitle] = useState("");

  const handleFeelingClick = (feeling) => {
    setPendingFeeling(feeling);
    setFeelingTitle("");
    setShowFeelingModal(true);
  };

  const handleSendFeeling = async () => {
    try {
      const payload = {
        title: feelingTitle || 'Nhật ký cảm xúc',
        feeling: pendingFeeling,
        createDate: new Date().toISOString(),
      };
      const data = await apiClient.post('/api/PregnancyDiary', payload);
      alert('Đã ghi nhận cảm xúc!');
      setShowFeelingModal(false);
    } catch (err) {
      console.error("Lỗi gửi cảm xúc:", err);
      alert('Có lỗi khi gửi cảm xúc!');
    }
  };

  return (
    <div className="pregnancy-diary-page">
      <div className="top-section">
        <div className="left-column">
          {/* Combobox chọn thai kỳ */}
          <div className="pregnancy-select-box" style={{ marginBottom: 12 }}>
            <label htmlFor="pregnancy-select">Chọn thai kỳ: </label>
            <select
              id="pregnancy-select"
              value={selectedPregnancyId || ''}
              onChange={e => setSelectedPregnancyId(Number(e.target.value))}
              style={{ padding: 4, borderRadius: 4 }}
            >
              {userPregnancies.map((preg) => (
                <option key={preg.pregnancyId} value={preg.pregnancyId}>
                  {preg.startDate} - {preg.dueDate}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị thông tin thai kỳ */}
          {loadingPregnancy ? (
            <div>Đang tải thông tin thai kỳ...</div>
          ) : (
            <>
              <div className="pregnancy-info-box custom-info-box">
                <h4>Thông tin thai kỳ</h4>
                {selectedPregnancy ? (
                  <ul className="custom-list">
                    {Object.entries(selectedPregnancy).map(([key, value]) => (
                      !hiddenFields.includes(key) && (
                        <li key={key}>
                          <b>{fieldLabels[key] || key}:</b> {key === 'createdAt' ? formatDate(value) : String(value)}
                        </li>
                      )
                    ))}
                  </ul>
                ) : <div>Không có dữ liệu thai kỳ</div>}
              </div>

              {/* Theo dõi thai kỳ (mẹ) */}
              <div className="pregnancy-tracking-box custom-info-box">
                <h4>Theo dõi thai kỳ (mẹ)</h4>
                {pregnancyTracking.length > 0 ? (
                  <div className="custom-table-wrap">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          {momTrackingFields.map(f => <th key={f.key}>{f.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {pregnancyTracking.map((track, idx) => (
                          <tr key={track.trackingId || idx}>
                            {momTrackingFields.map(f => <td key={f.key}>{track[f.key]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div>Không có dữ liệu theo dõi mẹ</div>}
              </div>

              {/* Theo dõi thai nhi (bé) */}
              <div className="baby-tracking-box custom-info-box">
                <h4>Theo dõi thai nhi (bé)</h4>
                {babyTracking.length > 0 ? (
                  <div className="custom-table-wrap">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          {babyTrackingFields.map(f => <th key={f.key}>{f.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {babyTracking.map((track, idx) => (
                          <tr key={track.checkupBabyId || idx}>
                            {babyTrackingFields.map(f => {
                              if (f.key === 'doctorComment') {
                                const val = track[f.key] || '';
                                if (val.length > 10) {
                                  return (
                                    <td key={f.key}>
                                      <button className="view-detail-btn" onClick={() => { setShowDoctorComment(true); setDoctorCommentDetail(val); }}>Xem chi tiết</button>
                                    </td>
                                  );
                                } else {
                                  return <td key={f.key}>{val}</td>;
                                }
                              } else {
                                return <td key={f.key}>{track[f.key]}</td>;
                              }
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div>Không có dữ liệu theo dõi bé</div>}
                {/* Popup chi tiết nhận xét bác sĩ */}
                {showDoctorComment && (
                  <div className="doctor-comment-modal-overlay">
                    <div className="doctor-comment-modal">
                      <button className="close-btn" onClick={() => setShowDoctorComment(false)}>×</button>
                      <h4>Chi tiết nhận xét bác sĩ</h4>
                      <div className="doctor-comment-content">{doctorCommentDetail}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="right-column">
          {/* Nút xem Mom Profile ở góc trên bên phải */}
          <button
            className="mom-profile-btn"
            onClick={() => navigate('/mom-profile')}
          >
            Thông tin của mẹ
          </button>
          <button
            className="add-pregnancy-btn"
            onClick={() => navigate('/user-pregnancy-form')}
          >
            Thêm thai kỳ mới
          </button>
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
          <div className="feeling-box" onClick={() => handleFeelingClick('Tôi gặp vấn đề')}>
            <div className="feeling-text">Need to Boost</div>
            <div className="feeling-description">Tôi gặp vấn đề</div>
          </div>
          <div className="feeling-box" onClick={() => handleFeelingClick('Tôi cảm thấy ổn')}>
            <div className="feeling-text">Need to Focus</div>
            <div className="feeling-description">Tôi cảm thấy ổn</div>
          </div>
          <div className="feeling-box" onClick={() => handleFeelingClick('Tôi cảm thấy thoải mái')}>
            <div className="feeling-text">Need to Rest</div>
            <div className="feeling-description">Tôi cảm thấy thoải mái</div>
          </div>
        </div>
        {showFeelingModal && (
          <div className="doctor-comment-modal-overlay">
            <div className="doctor-comment-modal">
              <button className="close-btn" onClick={() => setShowFeelingModal(false)}>×</button>
              <h4>Nhập tiêu đề cảm xúc</h4>
              <input
                className="feeling-title-input"
                type="text"
                placeholder="Nhập tiêu đề..."
                value={feelingTitle}
                onChange={e => setFeelingTitle(e.target.value)}
                style={{width: '100%', marginBottom: 16, padding: 8, fontSize: '1em', borderRadius: 8, border: '1px solid #eee'}}
              />
              <button className="view-detail-btn" onClick={handleSendFeeling} style={{marginTop: 8}}>Gửi</button>
            </div>
          </div>
        )}
      </div>

      {/* Render diary entries */}
      <div className="tittle">
        <h3>Nhật ký thai kỳ</h3>
      </div>
      <div className="diary-entries-list">
        {(showAllDiaryEntries ? diaryEntries : diaryEntries.slice(0, 5)).map((entry, index) => (
          <Comment
            key={index}
            date={entry.createDate}
            week={entry.feeling}
            title={entry.feeling}
            content={entry.title}
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
      {!showAllDiaryEntries && diaryEntries.length > 5 && (
        <button className="view-more-button" onClick={() => setShowAllDiaryEntries(true)}>Xem thêm</button>
      )}
    </div>
  );
};

export default PregnancyDiary;

/* Thêm CSS cho đẹp */
/* Thêm vào cuối file */
/*
.custom-info-box {
  background: #fff6fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(255,182,193,0.13);
  padding: 18px 20px 14px 20px;
  margin-bottom: 22px;
}
.custom-info-box h4 {
  color: #e91e63;
  margin-bottom: 12px;
  font-size: 1.18em;
  font-weight: 600;
}
.custom-list {
  list-style: none;
  padding-left: 0;
}
.custom-list li {
  padding: 4px 0;
  border-bottom: 1px dashed #ffe0ec;
  font-size: 1em;
  color: #333;
}
.custom-list li:last-child {
  border-bottom: none;
}
.custom-table-wrap {
  overflow-x: auto;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.98em;
  margin-bottom: 0;
}
.custom-table th, .custom-table td {
  padding: 8px 12px;
  text-align: left;
}
.custom-table th {
  background: #ffe0ec;
  color: #c2185b;
  font-weight: 600;
  border-bottom: 2px solid #ffb6c1;
}
.custom-table tr:nth-child(even) {
  background: #fff6fa;
}
.custom-table tr:hover {
  background: #ffe0ec44;
}
.custom-table td {
  border-bottom: 1px solid #ffe0ec;
}
.custom-table tr:last-child td {
  border-bottom: none;
}
@media (max-width: 600px) {
  .custom-info-box {
    padding: 10px 6px;
  }
  .custom-table th, .custom-table td {
    padding: 6px 4px;
    font-size: 0.95em;
  }
}
*/
