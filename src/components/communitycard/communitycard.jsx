import React, { useEffect, useState } from 'react';
import './communitycard.scss'; // Import the SCSS file
import { FaQuoteLeft } from "react-icons/fa";
// import apiClient from '../../services/api'; // No longer needed if using fetch directly

// Sample data (replace with API call later)
// Removed sample data as we are fetching from API

const CommunityCardSection = () => {
  // State to store testimonials fetched from API
  const [testimonials, setTestimonials] = useState([]);
  // State to track the number of testimonials to display
  const [displayCount, setDisplayCount] = useState(6); // Initially display 6

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://moca.mom:2030/api/communitypost');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTestimonials(data.$values || []); // Assuming data is in $values array
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu testimonials:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Function to load more testimonials
  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 6); // Increase display count by 6 (or any number you prefer)
  };

  // Determine if there are more testimonials to load
  const hasMore = testimonials.length > displayCount;

  return (
    <div className="community-section">
      <div className="container">
        <h2>Cộng đồng chia sẻ dành cho các mẹ bầu</h2>
        <div className="cards-grid">
          {testimonials.slice(0, displayCount).map((card, index) => ( // Slice the array to display only up to displayCount
            <div key={card.id || index} className="community-card"> {/* Use card.id for key if available, else index */}
              <div className="quote-icon"><FaQuoteLeft />
              </div>
              <p className="quote-text">{card.content}</p>
              <div className="card-footer">
                <img src={card.imageUrl || 'https://via.placeholder.com/40'} alt="User Avatar" className="avatar" /> {/* Use card.imageUrl */}
                <div className="author-info">
                  <p className="author-name">User ID: {card.userId}</p> {/* Placeholder for author name */}
                  <p className="author-title">Community Member</p> {/* Placeholder for author title */}
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMore && ( // Conditionally render the button
          <button className="view-more-button" onClick={loadMore}>Xem thêm</button>
        )}
      </div>
    </div>
  );
};

export default CommunityCardSection;