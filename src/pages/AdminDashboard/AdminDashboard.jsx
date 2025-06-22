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
        setCourses(coursesData);
        setCategories(categoriesRes.$values || []);

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
                id: `course-${course.courseId}`,
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
    const courseToEdit = courses.find(c => c.courseId === courseId);
    if (courseToEdit) {
      setEditingCourse(courseToEdit);
      setIsEditModalOpen(true);
    } else {
      console.error(`Không thể tìm thấy khóa học với ID ${courseId}.`);
    }
  };

  const handleSaveCourse = async (updatedCourse) => {
    console.log("Data received from modal:", updatedCourse);
    try {
      if (!updatedCourse.categoryId) {
        alert("Vui lòng chọn Category ID hợp lệ.");
        return;
      }
  
      const formData = new FormData();
      formData.append('CourseTitle', updatedCourse.courseTitle);
      formData.append('Description', updatedCourse.description);
      formData.append('Price', updatedCourse.price);
      formData.append('Image', updatedCourse.image || "");
      formData.append('CategoryId', updatedCourse.categoryId);

      await apiClient.put(`/api/Course/${updatedCourse.courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      setCourses(courses.map(c =>
        c.courseId === updatedCourse.courseId 
          ? { ...c, ...updatedCourse } // Merge changes to preserve all fields
          : c
      ));
      
      const newActivity = {
        id: `update-course-${updatedCourse.courseId}-${new Date().getTime()}`,
        text: `Course "${updatedCourse.courseTitle}" has been updated.`,
        time: new Date(),
        status: 'info'
      };
      setRecentActivity(prevActivities => [newActivity, ...prevActivities]);
      
      setIsEditModalOpen(false);
      setEditingCourse(null);
      alert("Cập nhật khóa học thành công!");

    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response?.data || error);
      alert("Cập nhật khóa học thất bại.");
    }
  };
  

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm(`Bạn có chắc muốn xóa khóa học ID: ${courseId}?`)) {
      try {
        const courseToDelete = courses.find(c => c.courseId === courseId);
        await apiClient.delete(`/api/Course/${courseId}`); // Assuming this endpoint exists
        setCourses(courses.filter(course => course.courseId !== courseId));

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