import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import Babau from "../../assets/Babau.png";
import thien from "../../assets/thien.png";

import CardInProgress from "../../components/cardInProgress/cardInProgress";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardCourse from "../../components/cardCourse/cardCourse";
import "./ServicePage.css";
import { useAuth } from "../../contexts/AuthContext";

const ServicePage = () => {
  // State to manage the number of visible cards for 'Đang học' section
  const [visibleInProgressCardsCount, setVisibleInProgressCardsCount] =
    useState(4);
  // State to track if more cards are shown than the initial count for 'Đang học' section
  const [showInProgressCollapseButton, setShowInProgressCollapseButton] =
    useState(false);

  // State to manage the number of visible cards for 'All Courses' section
  const [visibleAllCoursesCount, setVisibleAllCoursesCount] = useState(8);
  // State to track if more cards are shown than the initial count for 'All Courses' section
  const [showAllCoursesCollapseButton, setShowAllCoursesCollapseButton] =
    useState(false);

  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [purchasedCourses, setPurchasedCourses] = useState([]); // State to store purchased course details
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const { isLoggedIn, currentUser } = useAuth(); // Lấy cả currentUser

  // Lọc khóa học theo search term
  const filteredPurchasedCourses = purchasedCourses
    .filter(card => card.userId === currentUser?.userId)
    .filter(card => 
      card.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredCourses = courses
    .filter(card => 
      card.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    // Reset số lượng card hiển thị khi search
    setVisibleInProgressCardsCount(4);
    setVisibleAllCoursesCount(8);
    setShowInProgressCollapseButton(false);
    setShowAllCoursesCollapseButton(false);
  };

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://moca.mom:2030/api/Course");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data.$values || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchPurchasedCourses = async () => {
      if (!currentUser?.userId) {
        setPurchasedCourses([]);
        return;
      }
      try {
        const token = localStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };
        // Lấy danh sách các purchasedCourse của user (giữ lại API cũ để lấy danh sách id)
        const response = await fetch(`https://moca.mom:2030/api/PurchasedCourse?userId=${currentUser.userId}`, { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const purchasedCourseIds = data.$values ? data.$values.map(pc => pc.id || pc.purchasedId) : [];

        // Gọi API mới lấy chi tiết từng purchasedCourse
        const purchasedCourseDetailsPromises = purchasedCourseIds.map(async (id) => {
          try {
            const purchasedCourseResponse = await fetch(`https://moca.mom:2030/api/PurchasedCourse/${id}`, { headers });
            if (!purchasedCourseResponse.ok) {
              throw new Error(`HTTP error! status: ${purchasedCourseResponse.status}`);
            }
            return purchasedCourseResponse.json();
          } catch (detailError) {
            console.error(`Error fetching purchased course ${id}:`, detailError);
            return null;
          }
        });

        const purchasedCoursesData = (await Promise.all(purchasedCourseDetailsPromises)).filter(Boolean);

        // Fetch thêm thông tin chi tiết khóa học cho từng purchasedCourse
        const purchasedCoursesWithDetails = await Promise.all(
          purchasedCoursesData.map(async (purchasedCourse) => {
            try {
              const courseResponse = await fetch(`https://moca.mom:2030/api/Course/${purchasedCourse.courseId}`);
              if (!courseResponse.ok) {
                throw new Error(`HTTP error! status: ${courseResponse.status}`);
              }
              const courseData = await courseResponse.json();
              return {
                ...purchasedCourse,
                courseTitle: courseData.courseTitle,
                image: courseData.image,
                price: courseData.price,
                description: courseData.description,
                // Thêm các trường khác nếu cần
              };
            } catch (error) {
              console.error(`Error fetching course details for courseId ${purchasedCourse.courseId}:`, error);
              return purchasedCourse; // Trả về purchasedCourse nếu lỗi
            }
          })
        );
        setPurchasedCourses(purchasedCoursesWithDetails);
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      }
    };

    fetchCourses();
    fetchPurchasedCourses();
  }, [currentUser?.userId]);

  // Sample data for the service card
  const sampleService = {
    imageUrl: Babau, // Pass the imported image directly
    title: "Kỹ thuật chuyển dạ & chăm con sơ sinh",

    description:
      "Cung cấp kiến thức toàn diện về quá trình chuyển dạ, dấu hiệu sắp sinh, các giai đoạn sinh, tư thế rặn đẻ đúng, cách thở giảm đau, kỹ thuật sinh thường dễ dàng. Ngoài ra còn hướng dẫn mẹ chăm sóc hậu sản, phục hồi cơ thể và cách chăm sóc trẻ sơ sinh trong 3 tháng đầu.",
  };

  // Function to handle loading more cards for 'Đang học' section
  const handleLoadMoreInProgress = () => {
    // Increase the visible cards count by 4, or show all remaining cards
    setVisibleInProgressCardsCount((prevCount) =>
      Math.min(prevCount + 4, purchasedCourses.length) // Use purchasedCourses.length here
    );
    // Show the collapse button once more cards are loaded
    setShowInProgressCollapseButton(true);
  };

  // Function to handle collapsing cards for 'Đang học' section
  const handleCollapseInProgress = () => {
    // Reset visible cards count to initial 4
    setVisibleInProgressCardsCount(4);
    // Hide the collapse button
    setShowInProgressCollapseButton(false);
  };

  // Function to handle loading more cards for 'All Courses' section
  const handleLoadMoreAllCourses = () => {
    // Increase the visible cards count by 8, or show all remaining cards
    setVisibleAllCoursesCount((prevCount) =>
      Math.min(prevCount + 8, courses.length) // Use courses.length here
    );
    // Show the collapse button once more cards are loaded
    setShowAllCoursesCollapseButton(true);
  };

  // Function to handle collapsing cards for 'All Courses' section
  const handleCollapseAllCourses = () => {
    // Reset visible cards count to initial 8
    setVisibleAllCoursesCount(8);
    // Hide the collapse button
    setShowAllCoursesCollapseButton(false);
  };

  return (
    <div className="service-page">
      {/* Render the ServiceCard component */}
      <ServiceCard
        imageUrl={sampleService.imageUrl}
        title={sampleService.title}
        description={sampleService.description}
      />

      {/* Main title for Khóa học & Workshop section */}
      <h1>Khóa học & Workshop</h1>

      {/* Render the SearchBar component */}
      <SearchBar onSearch={handleSearch} />

      {/* Section for 'Đang học' cards */}
      {isLoggedIn && (
        <div className="cards-in-progress-section">
          <h2>Đang học</h2>
          {filteredPurchasedCourses.length > 0 ? (
            <>
              <div className="cards-list">
                {/* Render only the visible 'Đang học' cards của user hiện tại */}
                {filteredPurchasedCourses
                  .slice(0, visibleInProgressCardsCount)
                  .map((card, index) => (
                    <Link key={card.courseId || index} to={`/course/${card.courseId}`} className="card-link">
                      <CardInProgress
                        imageUrl={card.image || thien}
                        title={card.courseTitle}
                        description={card.description || "Chưa có mô tả cho khóa học này"}
                        
                        discountedPrice={`${card.price}đ`}
                        
                      />
                    </Link>
                  ))}
              </div>
              {/* Show the "Xem thêm" button for 'Đang học' only if there are more cards to load and collapse is not active */}
              {visibleInProgressCardsCount < filteredPurchasedCourses.length &&
                !showInProgressCollapseButton && (
                  <button
                    className="view-more-button"
                    onClick={handleLoadMoreInProgress}
                  >
                    Xem thêm
                  </button>
                )}
              {/* Show the "Thu gọn" button for 'Đang học' only if more than initial cards are visible */}
              {showInProgressCollapseButton && visibleInProgressCardsCount > 4 && (
                <button
                  className="view-more-button"
                  onClick={handleCollapseInProgress}
                >
                  Thu gọn
                </button>
              )}
            </>
          ) : (
            <div className="no-courses-message">
              {searchTerm ? 'Không tìm thấy khóa học nào !' : 'Hiện tại bạn chưa có khóa học nào !'}
            </div>
          )}
        </div>
      )}

      {/* Section for all course cards */}
      <div className="all-course-cards-section">
        <h2>All Courses & Workshops</h2>{" "}
        <div className="course-cards-list">
          {filteredCourses
            .slice(0, visibleAllCoursesCount)
            .map((card, index) => {
              const linkTo = `/course/${card.courseId}`; // Luôn dẫn tới trang chi tiết
              return (
                <Link key={card.courseId || index} to={linkTo} className="card-link">
                  <CardCourse
                    imageUrl={card.image || thien}
                    title={card.courseTitle}
                    description={card.description || "Chưa có mô tả cho khóa học này"}
                    originalPrice={`${card.price}đ`}
                    discountedPrice={`${card.price}đ`}
                    discountPercentage=""
                  />
                </Link>
              );
            })}
        </div>
        {/* Show the "Xem thêm" button for 'All Courses' only if there are more cards to load and collapse is not active */}
        {visibleAllCoursesCount < filteredCourses.length &&
          !showAllCoursesCollapseButton && (
            <button
              className="view-more-button"
              onClick={handleLoadMoreAllCourses}
            >
              Xem thêm
            </button>
          )}
        {/* Show the "Thu gọn" button for 'All Courses' only if more than initial cards are visible */}
        {showAllCoursesCollapseButton && visibleAllCoursesCount > 8 && (
          <button
            className="view-more-button"
            onClick={handleCollapseAllCourses}
          >
            Thu gọn
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
