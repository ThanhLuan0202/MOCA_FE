import React from "react";
import "./ServiceCard.scss";

const ServiceCard = ({ imageUrl, title, description }) => {
  return (
    <div className="service-card">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="content">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );
};

export default ServiceCard;
