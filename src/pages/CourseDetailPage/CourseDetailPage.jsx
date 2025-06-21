import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import './CourseDetailPage.scss' // Assuming you will create a SCSS file for styling
import thien from "../../assets/thien.png"; // Placeholder image
import { FaCaretDown } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth


const CourseDetailPage = () => {
    const { courseId } = useParams(); // Get courseId from URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOverview, setShowOverview] = useState(false); // New state for overview visibility
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState({}); // Stores lessons by chapterId
    const [expandedChapters, setExpandedChapters] = useState({}); // New state for tracking expanded chapters
    const [feedbacks, setFeedbacks] = useState([]); // New state for feedbacks
    const [newFeedback, setNewFeedback] = useState({ rating: 0, comment: '' }); // State for new feedback form
    const [users, setUsers] = useState({}); // New state to store user data
    const [isCoursePurchased, setIsCoursePurchased] = useState(false); // New state to track if the course is purchased
    const [hoverRating, setHoverRating] = useState(0); // New state for hover rating
    const token = localStorage.getItem('authToken');
    const getUserIdFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decodedToken = JSON.parse(jsonPayload);
            return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };
    const currentUserId = token ? getUserIdFromToken(token) : null;

    const { isLoggedIn } = useAuth(); // Use useAuth hook

    // Thêm state cho menu dropdown feedback
    const [openMenuFeedbackId, setOpenMenuFeedbackId] = useState(null);
    const menuRef = useRef(null);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuFeedbackId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [editFeedback, setEditFeedback] = useState({ rating: 0, comment: '' });

    // Định nghĩa fetchUser ở đây
    const fetchUser = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };
            const response = await fetch(`https://moca.mom:2030/api/User/${userId}`, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(prev => ({ ...prev, [userId]: { email: data.email, image: data.image } }));
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                console.log('Token for Course Details API:', token); // THÊM DÒNG NÀY
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                };
                const response = await fetch(`https://moca.mom:2030/api/Course/${courseId}`, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCourse(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourseContent = async () => {
            try {
                console.log('Token for Chapter/Lesson APIs:', token); // THÊM DÒNG NÀY
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                };

                // Fetch all chapters using the view-chapter endpoint
                const chaptersResponse = await fetch(`https://moca.mom:2030/api/Chapter/view-chapter`, { headers });
                if (!chaptersResponse.ok) throw new Error(`HTTP error! status: ${chaptersResponse.status}`);
                const chaptersData = await chaptersResponse.json();

                // Filter chapters by current courseId and sort by OrderIndex
                const filteredAndSortedChapters = (chaptersData.$values || [])
                    .filter(chapter => chapter.courseId === parseInt(courseId)) // Ensure type matching for comparison
                    .sort((a, b) => a.orderIndex - b.orderIndex);
                setChapters(filteredAndSortedChapters);

                // Fetch all lessons using the view-lesson endpoint
                const lessonsResponse = await fetch(`https://moca.mom:2030/api/Lesson/view-lesson`, { headers }); // Adjusted pageSize
                if (!lessonsResponse.ok) throw new Error(`HTTP error! status: ${lessonsResponse.status}`);
                const allLessonsData = await lessonsResponse.json();

                // Group and sort lessons by chapterId
                const lessonsMap = (allLessonsData.$values || []).reduce((acc, lesson) => {
                    if (!acc[lesson.chapterId]) {
                        acc[lesson.chapterId] = [];
                    }
                    acc[lesson.chapterId].push(lesson);
                    return acc;
                }, {});

                // Sort lessons within each chapter by OrderIndex
                for (const chapterId in lessonsMap) {
                    lessonsMap[chapterId].sort((a, b) => a.orderIndex - b.orderIndex);
                }
                setLessons(lessonsMap);

            } catch (err) {
                console.error("Error fetching course content:", err);
                // setError(err); // Consider setting a specific error state for content fetch
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                };
                const response = await fetch(`https://moca.mom:2030/api/Feedback`, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const filteredFeedbacks = (data.$values || []).filter(feedback => feedback.courseId === parseInt(courseId));
                setFeedbacks(filteredFeedbacks); // Initially display all feedbacks
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
            }
        };

        const fetchUserPurchasedCourses = async () => {
            if (!currentUserId) {
                console.log('No currentUserId!');
                return;
            }
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                };
                const response = await fetch(`https://moca.mom:2030/api/PurchasedCourse?userId=${currentUserId}`, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const purchasedCourseIds = data.$values ? data.$values.map(pc => pc.courseId) : [];
                const purchased = purchasedCourseIds.includes(parseInt(courseId));
                setIsCoursePurchased(purchased);
                console.log('Purchased course IDs:', purchasedCourseIds, 'Current courseId:', courseId, 'Purchased:', purchased);
            } catch (err) {
                console.error("Error fetching user's purchased courses:", err);
            }
        };

        if (courseId) {
            fetchCourseDetails();
            fetchCourseContent();
            fetchFeedbacks();
            fetchUserPurchasedCourses(); // Fetch purchased courses only if logged in
        }

        // Check login status on component mount
        if (isLoggedIn) {
            fetchUserPurchasedCourses(); // Fetch purchased courses only if logged in
        }
    }, [courseId, isLoggedIn]);

    // Khi render feedback, nếu chưa có user, gọi fetchUser
    useEffect(() => {
        feedbacks.forEach(fb => {
            if (fb.userId && !users[fb.userId]) {
                fetchUser(fb.userId);
            }
        });
        // eslint-disable-next-line
    }, [feedbacks]);

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...(localStorage.getItem('authToken') && { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` })
            };
            const response = await fetch(`https://moca.mom:2030/api/Feedback`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    ...newFeedback,
                    courseId: parseInt(courseId),
                    userId: parseInt(currentUserId)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Clear the form
            setNewFeedback({ rating: 0, comment: '' });
            // Re-fetch feedbacks to update the list
            const fetchFeedbacks = async () => {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        ...(localStorage.getItem('authToken') && { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` })
                    };
                    const res = await fetch(`https://moca.mom:2030/api/Feedback`, { headers });
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    const data = await res.json();
                    const filteredFeedbacks = (data.$values || []).filter(feedback => feedback.courseId === parseInt(courseId));
                    setFeedbacks(filteredFeedbacks);
                } catch (err) {
                    console.error("Error fetching feedbacks:", err);
                }
            };
            fetchFeedbacks();

        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert(`Failed to ${existingUserFeedback ? 'update' : 'submit'} feedback. Please try again.`);
        }
    };

    // Tìm feedback của user hiện tại (nếu có)
    const userFeedback = feedbacks.find(fb => String(fb.userId) === String(currentUserId));

    if (loading) {
        return <div className="course-detail-page">Loading course details...</div>;
    }

    if (error) {
        return <div className="course-detail-page">Error: {error.message}</div>;
    }

    if (!course) {
        return <div className="course-detail-page">Course not found.</div>;
    }

    return (
        <div className="course-detail-page">
            <div className="course-header">
                <img src={course.image || thien} alt={course.courseTitle} className="course-image" />
                <div className="course-info">
                    <h1 className="course-title">{course.courseTitle}</h1>
                    <p className="course-price">Price: {course.price}đ</p>
                    <p>Description: {course.description}</p>
                    {/* Add more course details here as needed from API response */}
                    {isLoggedIn && !isCoursePurchased && (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
                            <Link to='/payment' className="enroll-button">Enroll Now</Link>
                        </div>
                    )}
                </div>
            </div>


            <button className="overview-button" onClick={() => setShowOverview(!showOverview)}>
                {showOverview ? 'Hide Course Overview' : 'Course Overview'}
            </button>

            {showOverview && (
                <div className="course-overview-section">
                    <h3>Chapters</h3>
                    {chapters.length > 0 ? (
                        chapters.map(chapter => (
                            <div key={chapter.chapterId} className="chapter-item">
                                <div className="chapter-header" onClick={() => toggleChapter(chapter.chapterId)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0 }}>{chapter.orderIndex}. {chapter.title}</h4>
                                    <span style={{ marginLeft: '10px' }}>{expandedChapters[chapter.chapterId] ? '' : <FaCaretDown />}</span>
                                </div>
                                {isCoursePurchased && expandedChapters[chapter.chapterId] && lessons[chapter.chapterId] && lessons[chapter.chapterId].length > 0 && (
                                    <ul className="lessons-list">
                                        {lessons[chapter.chapterId].map(lesson => (
                                            <li key={lesson.lessonId} className="lesson-item">
                                                <p>{lesson.orderIndex}. {lesson.title} {lesson.duration ? `(${lesson.duration} mins)` : ''}</p>
                                                {lesson.content && <p className="lesson-content">{lesson.content}</p>}
                                                {lesson.videoURL && (
                                                    <div className="lesson-video-embed">
                                                        <iframe
                                                            width="560"
                                                            height="315"
                                                            src={`https://www.youtube.com/embed/${lesson.videoURL.split('v=')[1]}`}
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title={lesson.title}
                                                        ></iframe>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No chapters available for this course.</p>
                    )}
                </div>
            )}

            <div className="feedback-section">
                <h2>Feedbacks</h2>
                <div className="feedback-list">
                    {feedbacks.length > 0 ? (
                        feedbacks.map(feedback => {
                            const isOwnFeedback = currentUserId && feedback.userId && String(feedback.userId) === String(currentUserId);

                            // Nếu đang chỉnh sửa feedback này, chỉ render form nhưng vẫn giữ avatar và tên user
                            if (editingFeedbackId === feedback.feedbackId) {
                                return (
                                    <div key={feedback.feedbackId} className="feedback-item">
                                        <div className="feedback-header">
                                            <img src={users[feedback.userId]?.image || thien} alt="User Avatar" className="user-avatar" />
                                            <div className="user-info">
                                                <p className="username">{users[feedback.userId]?.email || 'Anonymous'}</p>
                                                <div className="rating-date">
                                                    <span className="stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i}>
                                                                {i < editFeedback.rating ? <FaStar /> : <FaRegStar />}
                                                            </i>
                                                        ))}
                                                    </span>
                                                    <span className="date">
                                                        {(() => {
                                                            const date = new Date(feedback.createDate);
                                                            return date instanceof Date && !isNaN(date) ? date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/,/g, '') : 'N/A';
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <form
                                            className="edit-feedback-form"
                                            style={{ 
                                                marginTop: 8, 
                                                background: '#fff', 
                                                borderRadius: 8, 
                                                padding: 16,
                                                border: '1px solid #ddd',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    const token = localStorage.getItem('authToken');
                                                    const headers = {
                                                        'Content-Type': 'application/json',
                                                        ...(token && { 'Authorization': `Bearer ${token}` })
                                                    };
                                                    const res = await fetch(`https://moca.mom:2030/api/Feedback/${feedback.feedbackId}`, {
                                                        method: 'PUT',
                                                        headers,
                                                        body: JSON.stringify({
                                                            ...feedback,
                                                            rating: editFeedback.rating,
                                                            comment: editFeedback.comment
                                                        })
                                                    });
                                                    if (!res.ok) throw new Error('Chỉnh sửa feedback thất bại!');
                                                    setFeedbacks(prev => prev.map(fb => fb.feedbackId === feedback.feedbackId ? { ...fb, rating: editFeedback.rating, comment: editFeedback.comment } : fb));
                                                    setEditingFeedbackId(null);
                                                } catch (err) {
                                                    alert('Chỉnh sửa feedback thất bại!');
                                                }
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '1.2rem', marginBottom: 12 }}>
                                                {[1,2,3,4,5].map((star) => (
                                                    <span
                                                        key={star}
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: star <= (editFeedback.rating) ? '#e74c3c' : '#e74c3c',
                                                            transition: 'all 0.2s ease',
                                                            transform: editFeedback.rating === star ? 'scale(1.2)' : 'scale(1)',
                                                            opacity: star <= editFeedback.rating ? 1 : 0.5
                                                        }}
                                                        onMouseEnter={() => setEditFeedback(fb => ({ ...fb, rating: star }))}
                                                        onClick={() => setEditFeedback(fb => ({ ...fb, rating: star }))}
                                                    >
                                                        {star <= editFeedback.rating ? <FaStar /> : <FaRegStar />}
                                                    </span>
                                                ))}
                                            </div>
                                            <textarea
                                                value={editFeedback.comment}
                                                onChange={e => setEditFeedback(fb => ({ ...fb, comment: e.target.value }))}
                                                style={{ 
                                                    width: '100%', 
                                                    minHeight: 80, 
                                                    marginBottom: 12,
                                                    padding: '8px 12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: 4,
                                                    fontSize: '14px',
                                                    resize: 'vertical'
                                                }}
                                                required
                                            />
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button 
                                                    type="submit" 
                                                    style={{ 
                                                        background: 'black', 
                                                        color: '#fff', 
                                                        border: 'none', 
                                                        borderRadius: 4, 
                                                        padding: '10px 16px', 
                                                        fontWeight: 500,
                                                        fontSize: '14px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Lưu
                                                </button>
                                                <button 
                                                    type="button" 
                                                    style={{ 
                                                        background: '#fff', 
                                                        color: '#666', 
                                                        border: '1px solid #ddd', 
                                                        borderRadius: 4, 
                                                        padding: '10px 16px', 
                                                        fontWeight: 500,
                                                        fontSize: '14px',
                                                        cursor: 'pointer'
                                                    }} 
                                                    onClick={() => setEditingFeedbackId(null)}
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                );
                            }

                            // Nếu không phải đang chỉnh sửa, render feedback như cũ
                            return (
                                <div key={feedback.feedbackId} className="feedback-item">
                                    <div className="feedback-header">
                                        <img src={users[feedback.userId]?.image || thien} alt="User Avatar" className="user-avatar" />
                                        <div className="user-info">
                                            <p className="username">{users[feedback.userId]?.email || 'Anonymous'}</p>
                                            <div className="rating-date">
                                                <span className="stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i}>
                                                            {i < feedback.rating ? <FaStar /> : <FaRegStar />}
                                                        </i>
                                                    ))}
                                                </span>
                                                <span className="date">
                                                    {(() => {
                                                        const date = new Date(feedback.createDate);
                                                        return date instanceof Date && !isNaN(date) ? date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/,/g, '') : 'N/A';
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="options-button" onClick={() => setOpenMenuFeedbackId(openMenuFeedbackId === feedback.feedbackId ? null : feedback.feedbackId)}><HiOutlineDotsHorizontal /></button>
                                        {isOwnFeedback && openMenuFeedbackId === feedback.feedbackId && (
                                            <div ref={menuRef} className="feedback-menu-dropdown" style={{ position: 'absolute', right: 0, top: 30, background: '#fff', border: '1px solid #eee', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 10 }}>
                                                <button
                                                    className="edit-feedback-button"
                                                    style={{ color: '#333', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '8px 16px', width: '100%', textAlign: 'left' }}
                                                    onClick={() => {
                                                        setEditingFeedbackId(feedback.feedbackId);
                                                        setEditFeedback({ rating: feedback.rating, comment: feedback.comment });
                                                        setOpenMenuFeedbackId(null);
                                                    }}
                                                >Chỉnh sửa</button>
                                                <button
                                                    className="delete-feedback-button"
                                                    style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '8px 16px', width: '100%', textAlign: 'left' }}
                                                    onClick={async () => {
                                                        if(window.confirm('Bạn có chắc muốn xóa feedback này?')) {
                                                            try {
                                                                const token = localStorage.getItem('authToken');
                                                                const headers = {
                                                                    'Content-Type': 'application/json',
                                                                    ...(token && { 'Authorization': `Bearer ${token}` })
                                                                };
                                                                const res = await fetch(`https://moca.mom:2030/api/Feedback/${feedback.feedbackId}`, {
                                                                    method: 'DELETE',
                                                                    headers
                                                                });
                                                                if (!res.ok) throw new Error('Xóa feedback thất bại!');
                                                                setFeedbacks(prev => prev.filter(fb => fb.feedbackId !== feedback.feedbackId));
                                                                setOpenMenuFeedbackId(null);
                                                            } catch (err) {
                                                                alert('Xóa feedback thất bại!');
                                                            }
                                                        }
                                                    }}
                                                >Xóa</button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="comment-text">{feedback.comment}</p>
                                    {/* Placeholder for images/videos in feedback */}
                                    {/* <div className="feedback-media">
                                        <img src="..." alt="Feedback Media" />
                                    </div> */}
                                    
                                </div>
                            );
                        })
                    ) : (
                        <p>No feedbacks yet. Be the first to leave one!</p>
                    )}
                </div>

                <h3>Leave a Feedback</h3>
                {isLoggedIn ? (
                    userFeedback ? (
                        <p style={{ color: '#888', fontStyle: 'italic', margin: '8px 0', textAlign: 'center' }}>
                            Bạn đã gửi feedback cho khóa học này. Bạn có thể chỉnh sửa hoặc xóa feedback phía trên.
                        </p>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                            <label>
                                Rating:
                                <div className="star-rating-input" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '2rem', margin: '8px 0' }}>
                                    {[1,2,3,4,5].map((star) => (
                                        <span
                                            key={star}
                                            style={{
                                                cursor: 'pointer',
                                                color: star <= (newFeedback.rating || hoverRating) ? '#e74c3c' : '#e74c3c',
                                                transition: 'color 0.2s',
                                                transform: hoverRating === star ? 'scale(1.2)' : 'scale(1)',
                                            }}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                                        >
                                            {star <= (hoverRating || newFeedback.rating) ? <FaStar /> : <FaRegStar />}
                                        </span>
                                    ))}
                                </div>
                            </label>
                            <label>
                                Comment:
                                <textarea
                                    value={newFeedback.comment}
                                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                                    required
                                ></textarea>
                            </label>
                            <button type="submit">Submit Feedback</button>
                        </form>
                    )
                ) : (
                    <p>Please log in to leave a feedback.</p>
                )}
            </div>

            {/* You can add sections for curriculum, reviews, etc. here */}
        </div>
    );
}

export default CourseDetailPage