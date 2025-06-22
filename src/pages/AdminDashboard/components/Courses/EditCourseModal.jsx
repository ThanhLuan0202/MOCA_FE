import React, { useState, useEffect } from 'react';
import './EditCourseModal.scss';

const EditCourseModal = ({ course, isOpen, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setFormData(course);
  }, [course]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle number conversion for price and categoryId
    const parsedValue =
      name === "price"
        ? parseFloat(value)
        : name === "categoryId"
        ? parseInt(value, 10)
        : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DEBUG FORM SUBMIT:", formData); // ✅ Gỡ lỗi nếu cần
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
