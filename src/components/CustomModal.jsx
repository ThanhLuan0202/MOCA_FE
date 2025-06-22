import React from 'react';
import './CustomModal.scss';

const CustomModal = ({ title, children, onClose }) => {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <button className="custom-modal-close" onClick={onClose}>×</button>
        {title && <h2 className="custom-modal-title">{title}</h2>}
        <div className="custom-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal; 