import React from "react";
import "./cardCourse.scss";

const CardCourse = ({
  imageUrl,
  title,
  description,
  originalPrice,
  discountedPrice,
  discountPercentage,
}) => {
  return (
    <div className="card-course">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-description">{description}</div>
        <div className="price-info">
          <span className="discounted-price">{discountedPrice}</span>
          
          
        </div>
      </div>
    </div>
  );
};

export default CardCourse;
