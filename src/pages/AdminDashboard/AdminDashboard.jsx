import React, { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.scss'; // Assuming you will create this SCSS file
import Sidebar from './components/Slidebar/Sidebar';
import CourseList from './components/Courses/CourseList';
import EditCourseModal from './components/Courses/EditCourseModal';
import { Routes, Route, useLocation } from 'react-router-dom';
import User from './components/Users/User';
import Doctor from './components/Doctor/Doctor';
import Mom from './components/Mom/Mom';
import AllMenu from './components/AllMenu/AllMenu';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [stats, setStats] = useState({ users: 0, doctors: 0, courses: 0, purchases: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, isLoggedIn, isLoadingAuth } = useAuth();
  const isAdmin = isLoggedIn && currentUser && currentUser.roleId === 1; // Check if user is Admin

  console.log("AdminDashboard - isLoggedIn:", isLoggedIn);
  console.log("AdminDashboard - currentUser:", currentUser);
  console.log("AdminDashboard - isAdmin:", isAdmin);
  console.log("AdminDashboard - isLoadingAuth:", isLoadingAuth);

  const fetchDashboardData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
        const [usersRes, doctorsRes, coursesRes, categoriesRes, momRes] = await Promise.all([
            apiClient.get('/api/User'),
            apiClient.get('/api/DoctorProfile'),
            apiClient.get('/api/Course'),
            apiClient.get('/api/CourseCategory'),
            apiClient.get('/api/MomProfile') // Assuming 'Mom' represents purchases for stats
        ]);

        const coursesData = coursesRes.$values || [];
        const categoriesData = categoriesRes.$values || [];
        
        console.log("Fetched courses data:", coursesData);
        console.log("Fetched categories data:", categoriesData);
        
        setCourses(coursesData);
        setCategories(categoriesData);

        setStats({
            users: (usersRes.$values || []).length,
            doctors: (doctorsRes.$values || []).length,
            courses: coursesData.length,
            purchases: (momRes.$values || []).length, // Assumption
        });

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        const recentUsers = (usersRes.$values || [])
            .filter(user => user.createdAt && new Date(user.createdAt) > twentyFourHoursAgo)
            .map(user => ({
                id: `user-${user.userId}`,
                text: `New user registered: ${user.fullName}`,
                time: new Date(user.createdAt),
                status: 'success'
            }));

        const recentCourses = (coursesData || [])
            .filter(course => course.createdAt && new Date(course.createdAt) > twentyFourHoursAgo)
            .map(course => ({
                id: `course-${course.$id || course.courseId}`,
                text: `New course added: ${course.courseTitle}`,
                time: new Date(course.createdAt),
                status: 'info'
            }));
        
        const recentDoctors = (doctorsRes.$values || [])
            .filter(doc => doc.createdAt && new Date(doc.createdAt) > twentyFourHoursAgo)
            .map(doc => ({
                id: `doctor-${doc.doctorId}`,
                text: `New doctor profile created: ${doc.fullName}`,
                time: new Date(doc.createdAt),
                status: 'success'
            }));

        const recentMoms = (momRes.$values || [])
            .filter(mom => mom.createdAt && new Date(mom.createdAt) > twentyFourHoursAgo)
            .map(mom => ({
                id: `mom-${mom.momId}`,
                text: `New mom profile created for user ID: ${mom.userId}`,
                time: new Date(mom.createdAt),
                status: 'success'
            }));

        const allActivities = [...recentUsers, ...recentCourses, ...recentDoctors, ...recentMoms];
        allActivities.sort((a, b) => b.time - a.time);

        setRecentActivity(allActivities);

    } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error("Error fetching dashboard data:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AdminDashboard useEffect - isAdmin:", isAdmin);
    console.log("AdminDashboard useEffect - isLoggedIn:", isLoggedIn);
    if (isAdmin) {
      fetchDashboardData();
    } else if (isLoggedIn && !isLoadingAuth) {
      // Optionally redirect non-admin logged-in users or show a message
      console.log("User is not an admin. Access denied.");
      // navigate('/'); // Example: redirect to home
    }
  }, [isAdmin, isLoggedIn, isLoadingAuth]); // Add isLoadingAuth to dependencies

  const handleEditCourse = (courseId) => {
    console.log("Attempting to edit course with ID:", courseId);
    console.log("Available courses:", courses);
    
    const courseToEdit = courses.find(c => (c.$id || c.courseId) === courseId);
    if (courseToEdit) {
      console.log("Found course to edit:", courseToEdit);
      setEditingCourse(courseToEdit);
      setIsEditModalOpen(true);
    } else {
      console.error(`Không thể tìm thấy khóa học với ID ${courseId}.`);
      console.error("Available course IDs:", courses.map(c => c.$id || c.courseId));
      alert(`Không thể tìm thấy khóa học với ID ${courseId}.`);
    }
  };

  const verifyCourseExists = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://moca.mom:2030/api/Course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const courseData = await response.json();
        console.log("Course exists on server:", courseData);
        return true;
      } else {
        console.log(`Course with ID ${courseId} not found on server. Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error("Error verifying course existence:", error);
      return false;
    }
  };

  const handleSaveCourse = async (updatedCourse) => {
    console.log("Data received from modal:", updatedCourse);
    console.log("Categories available:", categories);
    
    try {
      // Determine the correct course ID to use
      const courseIdToUse = updatedCourse.$id || updatedCourse.courseId;
      
      // Validate course data before sending
      if (!courseIdToUse) {
        alert("Lỗi: Không tìm thấy ID khóa học.");
        return;
      }
      
      if (!updatedCourse.categoryId) {
        alert("Vui lòng chọn Category ID hợp lệ.");
        return;
      }
      
      // Verify that the category exists
      const categoryExists = categories.find(cat => cat.categoryId === updatedCourse.categoryId);
      if (!categoryExists) {
        alert(`Lỗi: Không tìm thấy category với ID ${updatedCourse.categoryId}. Vui lòng chọn category khác.`);
        return;
      }
      
      // Verify that the course exists in our local state
      const courseExists = courses.find(c => (c.$id || c.courseId) === courseIdToUse);
      if (!courseExists) {
        alert(`Lỗi: Không tìm thấy khóa học với ID ${courseIdToUse} trong danh sách.`);
        return;
      }

      // Verify that the course exists on the server
      const courseExistsOnServer = await verifyCourseExists(courseIdToUse);
      if (!courseExistsOnServer) {
        alert(`Lỗi: Khóa học với ID ${courseIdToUse} không tồn tại trên server.`);
        return;
      }
  
      const formData = new FormData();
      formData.append('CourseTitle', updatedCourse.courseTitle);
      formData.append('Description', updatedCourse.description);
      formData.append('Price', updatedCourse.price);
      formData.append('Image', updatedCourse.image || "");
      formData.append('CategoryId', updatedCourse.categoryId);

      console.log("Sending PUT request to:", `/api/Course/${courseIdToUse}`);
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Try using direct fetch instead of apiClient
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`https://moca.mom:2030/api/Course/${courseIdToUse}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
    
      setCourses(courses.map(c =>
        (c.$id || c.courseId) === courseIdToUse
          ? { ...c, ...updatedCourse } // Merge changes to preserve all fields
          : c
      ));
      
      const newActivity = {
        id: `update-course-${courseIdToUse}-${new Date().getTime()}`,
        text: `Course "${updatedCourse.courseTitle}" has been updated.`,
        time: new Date(),
        status: 'info'
      };
      setRecentActivity(prevActivities => [newActivity, ...prevActivities]);
      
      setIsEditModalOpen(false);
      setEditingCourse(null);
      alert("Cập nhật khóa học thành công!");

    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      
      let errorMessage = "Cập nhật khóa học thất bại.";
      
      if (error.message.includes('404')) {
        errorMessage = `Không tìm thấy khóa học với ID ${courseIdToUse} trên server.`;
      } else if (error.message.includes('Category with Id')) {
        errorMessage = `Lỗi category: ${error.message}`;
      } else if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };
  

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm(`Bạn có chắc muốn xóa khóa học ID: ${courseId}?`)) {
      try {
        const courseToDelete = courses.find(c => (c.$id || c.courseId) === courseId);
        await apiClient.delete(`/api/Course/${courseId}`); // Assuming this endpoint exists
        setCourses(courses.filter(course => (course.$id || course.courseId) !== courseId));

        if (courseToDelete) {
          const newActivity = {
              id: `delete-course-${courseId}-${new Date().getTime()}`,
              text: `Course "${courseToDelete.courseTitle}" has been deleted.`,
              time: new Date(),
              status: 'danger' // Or another status like 'danger' if you add styles for it
          };
          setRecentActivity(prevActivities => [newActivity, ...prevActivities]);
        }

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
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="admin-dashboard-content">
        <Routes>
          <Route path="/" element={
              <AllMenu
                stats={stats}
                recentActivity={recentActivity}
                loading={loading}
                error={error}
                onRefresh={fetchDashboardData}
              />
            } 
          />
          <Route
            path="courses"
            element={
              <CourseList 
                courses={courses} 
                onDelete={handleDeleteCourse}
                onEdit={handleEditCourse}
                categories={categories}
              />
            }
          />
          <Route
            path="users"
            element={<User />}
          />
          <Route
            path="doctor"
            element={<Doctor />}
          />
          <Route
            path="mom"
            element={<Mom />}
          />
          {/* Thêm các route con khác nếu cần */}
        </Routes>
      </div>
      <EditCourseModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCourse}
        course={editingCourse}
        categories={categories}
      />
    </div>
  );
};

export default AdminDashboard;