import React from "react";
import "./comment.scss"; // Import the CSS file

const Comment = ({ date, week, title, content }) => {
  return (
    <div className="diary-entry">
      <div className="entry-header">
        <span className="entry-date">{date}</span>
        <span className="entry-week"> | {week}</span>
      </div>
      <div className="entry-title">{title}</div>
      <div className="entry-content">{content}</div>
    </div>
  );
};

export default Comment;
