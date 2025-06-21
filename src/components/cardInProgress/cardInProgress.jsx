import React from "react";
import "./cardInProgress.scss";

const CardInProgress = ({
  imageUrl,
  title,
  description,
  originalPrice,
  discountedPrice,
  discountPercentage,
}) => {
  return (
    <div className="card-in-progress">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-description">{description}</div>
        <div className="price-info">
          <span className="discounted-price">{discountedPrice}</span>
          <span className="original-price">{originalPrice}</span>
          
        </div>
      </div>
    </div>
  );
};

export default CardInProgress;
