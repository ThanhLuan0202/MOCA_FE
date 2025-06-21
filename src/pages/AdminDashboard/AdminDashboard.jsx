import React, { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.scss'; // Assuming you will create this SCSS file

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const { currentUser, isLoggedIn, isLoadingAuth } = useAuth();
  const isAdmin = isLoggedIn && currentUser && currentUser.roleId === 1; // Check if user is Admin

  console.log("AdminDashboard - isLoggedIn:", isLoggedIn);
  console.log("AdminDashboard - currentUser:", currentUser);
  console.log("AdminDashboard - isAdmin:", isAdmin);
  console.log("AdminDashboard - isLoadingAuth:", isLoadingAuth);

  useEffect(() => {
    console.log("AdminDashboard useEffect - isAdmin:", isAdmin);
    console.log("AdminDashboard useEffect - isLoggedIn:", isLoggedIn);
    if (isAdmin) {
      fetchCourses();
    } else if (isLoggedIn && !isLoadingAuth) {
      // Optionally redirect non-admin logged-in users or show a message
      console.log("User is not an admin. Access denied.");
      // navigate('/'); // Example: redirect to home
    }
  }, [isAdmin, isLoggedIn, isLoadingAuth]); // Add isLoadingAuth to dependencies

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get('/api/Course'); // Assuming this endpoint exists
      setCourses(response.$values || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ID: ${courseId}?`)) {
      try {
        await apiClient.delete(`/api/Course/${courseId}`); // Assuming this endpoint exists
        setCourses(courses.filter(course => course.courseId !== courseId));
        alert("Course deleted successfully!");
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course.");
      }
    }
  };

  if (isLoadingAuth) {
    return <div className="admin-dashboard-loading">Loading admin panel...</div>;
  }

  if (!isAdmin) {
    return <div className="admin-dashboard-access-denied">Access Denied. You must be an Admin to view this page.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard - Course Management</h1>
      <div className="course-list-container">
        <h2>All Courses</h2>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <table className="course-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseId}</td>
                  <td>{course.courseTitle}</td>
                  <td>{course.price}</td>
                  <td>{course.description}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCourse(course.courseId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;