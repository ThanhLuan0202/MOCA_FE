import React, { useState } from "react";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import Babau from "../../assets/Babau.png";
import thien from "../../assets/thien.png";

import CardInProgress from "../../components/cardInProgress/cardInProgress";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardCourse from "../../components/cardCourse/cardCourse";
import "./ServicePage.css";

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

  // Sample data for the service card
  const sampleService = {
    imageUrl: Babau, // Pass the imported image directly
    title: "Kỹ thuật chuyển dạ & chăm con sơ sinh",

    description:
      "Cung cấp kiến thức toàn diện về quá trình chuyển dạ, dấu hiệu sắp sinh, các giai đoạn sinh, tư thế rặn đẻ đúng, cách thở giảm đau, kỹ thuật sinh thường dễ dàng. Ngoài ra còn hướng dẫn mẹ chăm sóc hậu sản, phục hồi cơ thể và cách chăm sóc trẻ sơ sinh trong 3 tháng đầu.",
  };

  // Sample data for the 'Đang học' cards
  const cardsInProgressData = [
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
  ];

  // Sample data for the main course/workshop cards (all courses section)
  const allCourseCardsData = [
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
    {
      imageUrl: thien, // Replace with actual image URLs
      title: "Khóa học Yoga cho các mẹ bắt đầu vào thai kỳ",
      originalPrice: "1.000.000đ",
      discountedPrice: "300.000đ",
      discountPercentage: "-70%",
    },
  ];

  // Function to handle loading more cards for 'Đang học' section
  const handleLoadMoreInProgress = () => {
    // Increase the visible cards count by 4, or show all remaining cards
    setVisibleInProgressCardsCount((prevCount) =>
      Math.min(prevCount + 4, cardsInProgressData.length)
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
      Math.min(prevCount + 8, allCourseCardsData.length)
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
      <SearchBar />

      {/* Section for 'Đang học' cards */}
      <div className="cards-in-progress-section">
        <h2>Đang học</h2>
        <div className="cards-list">
          {/* Render only the visible 'Đang học' cards */}
          {cardsInProgressData
            .slice(0, visibleInProgressCardsCount)
            .map((card, index) => (
              <CardInProgress
                key={index}
                imageUrl={card.imageUrl}
                title={card.title}
                originalPrice={card.originalPrice}
                discountedPrice={card.discountedPrice}
                discountPercentage={card.discountPercentage}
              />
            ))}
        </div>
        {/* Show the "Xem thêm" button for 'Đang học' only if there are more cards to load and collapse is not active */}
        {visibleInProgressCardsCount < cardsInProgressData.length &&
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
      </div>

      {/* Section for all course cards */}
      <div className="all-course-cards-section">
        <h2>All Courses & Workshops</h2>{" "}
        {/* You might want a different title here */}
        <div className="course-cards-list">
          {/* Render only the visible 'All Courses' cards */}
          {allCourseCardsData
            .slice(0, visibleAllCoursesCount)
            .map((card, index) => (
              <CardCourse
                key={index}
                imageUrl={card.imageUrl}
                title={card.title}
                originalPrice={card.originalPrice}
                discountedPrice={card.discountedPrice}
                discountPercentage={card.discountPercentage}
              />
            ))}
        </div>
        {/* Show the "Xem thêm" button for 'All Courses' only if there are more cards to load and collapse is not active */}
        {visibleAllCoursesCount < allCourseCardsData.length &&
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
