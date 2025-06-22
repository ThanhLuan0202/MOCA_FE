import React, { useState, useEffect } from "react";
import apiClient from "../../../../services/api";
import "./CourseList.scss";

const CourseList = ({ courses, onDelete, onEdit, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortType, setSortType] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortOption, setSortOption] = useState("all");

  // Lọc courses theo search và filter
  let filteredCourses = courses.filter((course) => {
    const matchSearch = course.courseTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && course.status === "published") ||
      (filterStatus === "draft" && course.status === "draft");
    return matchSearch && matchStatus;
  });

  console.log('Current categories state:', categories);

  if (sortOption === "price-asc") {
    filteredCourses.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "price-desc") {
    filteredCourses.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === "name-asc") {
    filteredCourses.sort((a, b) => (a.courseTitle || '').localeCompare(b.courseTitle || ''));
  } else if (sortOption === "name-desc") {
    filteredCourses.sort((a, b) => (b.courseTitle || '').localeCompare(a.courseTitle || ''));
  } else if (sortOption === "date-asc") {
    filteredCourses.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
  } else if (sortOption === "date-desc") {
    filteredCourses.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  }

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h2>Danh sách Courses</h2>
        <div className="course-list-controls" style={{ gap: 8 }}>
          <input
            className="course-search"
            type="text"
            placeholder="Tìm kiếm courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="course-sort-menu"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="date-desc">Ngày tạo mới nhất</option>
            <option value="date-asc">Ngày tạo cũ nhất</option>
          </select>
        </div>
      </div>
      {filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="course-table">
          <thead>
            <tr>
              <th>Tên Course</th>
              <th>Category</th>
              {/* <th>Giảng viên</th> */}
              {/* <th>Học viên</th> */}
              <th className="text-center">Image</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => {
              const category = categories?.find(cat => cat.categoryId === course.categoryId);
              console.log(`Course: "${course.courseTitle}", categoryId: ${course.categoryId}, Found category:`, category);
              return (
                <tr key={course.courseId}>
                  <td>{course.courseTitle}</td>
                  <td className="category-cell">
                    <span className={`course-category-badge category-${(category?.name || '').toLowerCase()}`}>{category?.name || 'N/A'}</span>
                  </td>
                  {/* <td>{course.instructor || 'N/A'}</td> */}
                  {/* <td>{course.students || 0}</td> */}
                  <td>
                    {course.image && (
                      <img
                        src={course.image}
                        alt={course.courseTitle}
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
                  </td>
                  <td>
                    {course.price
                      ? `₫${course.price.toLocaleString()}`
                      : "N/A"}
                  </td>
                  <td>
                    {course.status === "Active" ? (
                      <span className="course-status-badge published">
                        active
                      </span>
                    ) : (
                      <span className="course-status-badge draft">not active</span>
                    )}
                  </td>
                  <td className="course-description">
                    {course.description || "N/A"}
                  </td>
                  <td>
                    {course.createDate
                      ? new Date(course.createDate).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      title="Edit"
                      onClick={() => onEdit(course.courseId)}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M4 21h4.586a1 1 0 0 0 .707-.293l10-10a1 1 0 0 0 0-1.414l-4.586-4.586a1 1 0 0 0-1.414 0l-10 10A1 1 0 0 0 4 16.414V21z"
                          stroke="#222"
                          strokeWidth="1.5"
                        />
                        <path d="M14.5 6.5l3 3" stroke="#222" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => onDelete(course.courseId)}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z"
                          stroke="#e74c3c"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CourseList;