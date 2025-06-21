import React, { useState, useEffect } from 'react';
import './ProfileCoach.scss';
import apiClient from '../../services/api';

const ProfileCoach = () => {
  const [showChat, setShowChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [doctorProfiles, setDoctorProfiles] = useState([]);

  useEffect(() => {
    const fetchDoctorProfiles = async () => {
      try {
        const response = await fetch('https://moca.mom:2030/api/DoctorProfiles');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctorProfiles(data.$values || []); // Assuming data is in $values array
      } catch (error) {
        console.error("Error fetching doctor profiles:", error);
      }
    };

    fetchDoctorProfiles();
  }, []);

  const mainDoctor = doctorProfiles.length > 0 ? doctorProfiles[0] : null;
  const suggestedDoctors = doctorProfiles.slice(1);

  const handleBook = async (doctorId) => {
    try {
      const response = await apiClient.post('/api/DoctorBookings', {
        doctorId: doctorId,
        userId: 'placeholderUserId', // Replace with actual logged-in user ID
        bookingDate: new Date().toISOString() // Use current date/time in ISO format
      });
      // Axios automatically throws for non-2xx status codes, so no need for response.ok check
      // const data = await response.json(); // Not needed for Axios
      console.log("Booking successful:", response.data);
    } catch (error) {
      console.error("Error booking:", error);
      // Access error response data if available
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
    }
  };

  return (
    <div className="profile-coach-container">
      <div className="profile-header">
        <div className="profile-image-container">
          {/* Placeholder image as ImageUrl is not in schema */}
          <img src="https://via.placeholder.com/200" alt="Coach Profile" className="profile-image" />
        </div>
        <div className="profile-info">
          <h1 className="coach-name">{mainDoctor ? mainDoctor.fullName : 'Loading...'}</h1>
          <p className="coach-detail">Area of expertise: <span className="highlight">{mainDoctor ? mainDoctor.specialization : 'Loading...'}</span></p>
          <p className="coach-detail">Working unit: <span className="highlight">Tư nhân</span></p> {/* Placeholder */}
          <p className="coach-detail">Experiences: <span className="highlight">N/A</span></p> {/* Placeholder */}
          <p className="coach-detail">Field: <span className="highlight">{mainDoctor ? mainDoctor.specialization : 'Loading...'}</span></p>
          {mainDoctor && mainDoctor.doctorBookings && mainDoctor.doctorBookings.$values && (
            <p className="coach-detail">Bookings: <span className="highlight">{mainDoctor.doctorBookings.$values.join(', ')}</span></p>
          )}
          {mainDoctor && mainDoctor.doctorContacts && mainDoctor.doctorContacts.$values && (
            <p className="coach-detail">Contacts: <span className="highlight">{mainDoctor.doctorContacts.$values.join(', ')}</span></p>
          )}
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span> {/* Placeholder */}
          </div>
          <button className="book-button" onClick={() => mainDoctor && handleBook(mainDoctor.doctorId)}>Book </button>
          
        </div>
      </div>

      <div className="profile-description">
        <p>{mainDoctor ? mainDoctor.description : 'Loading doctor description...'}</p>
      </div>

      <div className="suggested-coaches-section">
        <h2 className="suggested-heading">Gợi ý bác sĩ</h2>
        <div className="suggested-coaches-grid">
          {suggestedDoctors.map((doctor, index) => (
            <div key={doctor.doctorId || index} className="coach-card">
              <img src="https://via.placeholder.com/200" alt="Suggested Coach" className="coach-image"/> {/* Placeholder image */}
              <h3 className="coach-name">{doctor.fullName}</h3>
              <p className="coach-title">{doctor.specialization}</p>
              <div className="coach-rating">
                <span>★☆☆☆☆</span> <span>1/5</span>
              </div>
            </div>
          ))}
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
