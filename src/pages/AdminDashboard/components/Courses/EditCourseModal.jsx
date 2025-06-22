import React, { useState, useEffect } from 'react';
import './EditCourseModal.scss';

const EditCourseModal = ({ course, isOpen, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    console.log("EditCourseModal: Course data received:", course);
    console.log("EditCourseModal: Categories data received:", categories);
    setFormData(course);
  }, [course]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle different field types
    let parsedValue = value;
    
    if (name === "price") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    } else if (name === "categoryId") {
      // Ensure categoryId is a valid number and not empty
      parsedValue = value === "" ? null : parseInt(value, 10);
      if (isNaN(parsedValue)) {
        parsedValue = null;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate categoryId before submitting
    if (!formData.categoryId || formData.categoryId === null) {
      alert("Vui lòng chọn một danh mục hợp lệ.");
      return;
    }
    
    console.log("DEBUG FORM SUBMIT:", formData);
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Chỉnh sửa Khóa học</h2>

          <div className="form-group">
            <label htmlFor="courseTitle">Tên khóa học</label>
            <input
              type="text"
              id="courseTitle"
              name="courseTitle"
              value={formData.courseTitle || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || 0}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              {categories && categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Hủy</button>
            <button type="submit" className="btn-save">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
