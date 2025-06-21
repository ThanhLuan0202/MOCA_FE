import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PregnancyDiaryPage.scss';

const PregnancyDiaryPage = () => {
  const [userPregnancies, setUserPregnancies] = useState([]);
  const [selectedPregnancy, setSelectedPregnancy] = useState(null);
  const [pregnancyTrackings, setPregnancyTrackings] = useState([]);
  const [babyTrackings, setBabyTrackings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch UserPregnancies
        const pregnanciesResponse = await axios.get('https://moca.mom:2030/api/UserPregnancies', {
          withCredentials: true
        });
        const pregnancies = pregnanciesResponse.data.$values;
        setUserPregnancies(pregnancies);

        // Set default selected pregnancy (most recent one)
        if (pregnancies.length > 0) {
          const mostRecent = pregnancies.reduce((latest, current) => {
            return new Date(current.startDate) > new Date(latest.startDate) ? current : latest;
          });
          setSelectedPregnancy(mostRecent);
        }
      } catch (error) {
        console.error('Error fetching pregnancies:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTrackingData = async () => {
      if (!selectedPregnancy) return;

      try {
        // Fetch PregnancyTrackings
        const trackingResponse = await axios.get('https://moca.mom:2030/api/PregnancyTracking', {
          withCredentials: true
        });
        const trackings = trackingResponse.data.$values.filter(
          tracking => tracking.pregnancyId === selectedPregnancy.pregnancyId
        );
        setPregnancyTrackings(trackings);

        // Fetch BabyTrackings
        const babyTrackingResponse = await axios.get('https://moca.mom:2030/api/BabayTracking', {
          withCredentials: true
        });
        const babyTrackings = babyTrackingResponse.data.$values.filter(
          tracking => tracking.pregnancyId === selectedPregnancy.pregnancyId
        );
        setBabyTrackings(babyTrackings);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    fetchTrackingData();
  }, [selectedPregnancy]);

  const handlePregnancyChange = (e) => {
    const selected = userPregnancies.find(p => p.pregnancyId === parseInt(e.target.value));
    setSelectedPregnancy(selected);
  };

  return (
    <div className="pregnancy-diary">
      <div className="pregnancy-selector">
        <select 
          value={selectedPregnancy?.pregnancyId || ''} 
          onChange={handlePregnancyChange}
          className="pregnancy-select"
        >
          {userPregnancies.map(pregnancy => (
            <option key={pregnancy.pregnancyId} value={pregnancy.pregnancyId}>
              Thai kỳ từ {new Date(pregnancy.startDate).toLocaleDateString()} đến {new Date(pregnancy.dueDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <div className="diary-container">
        <div className="left-column">
          {selectedPregnancy && (
            <>
              <div className="pregnancy-info">
                <h3>Thông tin thai kỳ</h3>
                <p>Ngày bắt đầu: {new Date(selectedPregnancy.startDate).toLocaleDateString()}</p>
                <p>Ngày dự sinh: {new Date(selectedPregnancy.dueDate).toLocaleDateString()}</p>
                <p>Ghi chú: {selectedPregnancy.notes}</p>
              </div>

              <div className="tracking-info">
                <h3>Theo dõi thai kỳ</h3>
                {pregnancyTrackings.map(tracking => (
                  <div key={tracking.trackingId} className="tracking-item">
                    <p>Ngày: {new Date(tracking.trackingDate).toLocaleDateString()}</p>
                    <p>Tuần thai: {tracking.weekNumber}</p>
                    <p>Cân nặng: {tracking.weight} kg</p>
                    <p>Vòng bụng: {tracking.bellySize} cm</p>
                    <p>Huyết áp: {tracking.bloodPressure}</p>
                  </div>
                ))}
              </div>

              <div className="baby-tracking-info">
                <h3>Khám thai nhi</h3>
                {babyTrackings.map(tracking => (
                  <div key={tracking.checkupBabyId} className="tracking-item">
                    <p>Ngày khám: {new Date(tracking.checkupDate).toLocaleDateString()}</p>
                    <p>Nhịp tim thai: {tracking.fetalHeartRate} bpm</p>
                    <p>Cân nặng ước tính: {tracking.estimatedWeight} kg</p>
                    <p>Chỉ số nước ối: {tracking.amnioticFluidIndex}</p>
                    <p>Vị trí nhau thai: {tracking.placentaPosition}</p>
                    <p>Nhận xét bác sĩ: {tracking.doctorComment}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="right-column">
          {/* Future content like list of entries, add new entry button, etc. */}
          <p>Chức năng ghi chú và theo dõi sẽ được cập nhật tại đây.</p>
        </div>
      </div>
    </div>
  );
};

export default PregnancyDiaryPage; 