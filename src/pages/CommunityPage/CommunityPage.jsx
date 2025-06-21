import React, { useState, useEffect } from 'react';
import './CommunityPage.scss';
import { FaQuoteLeft, FaEnvelope, FaImage, FaTimes } from 'react-icons/fa'; // Import icons
import { useAuth } from '../../contexts/AuthContext';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent', 'newest', 'my-posts'
  const [shareText, setShareText] = useState('');
  const [posts, setPosts] = useState([]); // Initialize posts as an empty array
  const [users, setUsers] = useState({}); // Store user information by userId
  const { currentUser, isLoggedIn } = useAuth();
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Vui lòng chọn file ảnh");
        return;
      }
      setSelectedImage(file);
      // Create preview URL
      const preview = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up old preview
      }
      setPreviewUrl(preview);
      setError('');
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl('');
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://moca.mom:2030/api/CommunityPost');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the actual post data is within the $values array
      const postsData = data.$values || [];
      setPosts(postsData);

      // Fetch user information for each unique userId
      const uniqueUserIds = [...new Set(postsData.map(post => post.userId))];
      for (const userId of uniqueUserIds) {
        fetchUserInfo(userId);
      }
    } catch (error) {
      console.error("Error fetching community posts:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`https://moca.mom:2030/api/User/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUsers(prev => ({
        ...prev,
        [userId]: userData
      }));
    } catch (error) {
      console.error(`Error fetching user info for userId ${userId}:`, error);
    }
  };

  const handleShareSubmit = async () => {
    if (!isLoggedIn) {
      setError("Vui lòng đăng nhập để đăng bài");
      return;
    }

    if (!shareText.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    setIsPosting(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      let imageUrl = '';

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
          const imageResponse = await fetch('https://moca.mom:2030/api/CommunityPost', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
              // Don't set Content-Type header - browser will set it automatically with boundary
            },
            body: formData
          });

          if (!imageResponse.ok) {
            throw new Error(`Image upload failed with status: ${imageResponse.status}`);
          }

          const imageData = await imageResponse.json();
          if (!imageData || !imageData.url) {
            throw new Error('Invalid image upload response format');
          }

          imageUrl = imageData.url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      const postData = {
        userId: currentUser.userId,
        title: "Community Post",
        content: shareText.trim(),
        tags: "community",
        imageUrl: imageUrl,
        status: "Active"
      };

      const response = await fetch('https://moca.mom:2030/api/CommunityPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShareText('');
      removeImage();
      await fetchPosts();
      setError('');
    } catch (error) {
      console.error("Error posting content:", error);
      if (error.message.includes('upload image')) {
        setError("Không thể tải lên ảnh. Vui lòng thử lại sau.");
      } else {
        setError("Không thể đăng bài. Vui lòng thử lại sau.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  const filterPosts = () => {
    switch (activeTab) {
      case 'newest':
        return [...posts].sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
      case 'my-posts':
        return posts.filter(post => post.userId === currentUser?.userId);
      case 'recent':
      default:
        return posts;
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Cộng đồng chia sẻ dành cho các mẹ bầu</h1>
        <p>Hãy để lại những chia sẻ của bạn dành cho các mẹ bầu</p>
        <div className="share-container">
          <div className="share-input-container">
            <input
              type="text"
              placeholder={isLoggedIn ? "Hãy chia sẻ cho chúng tôi" : "Vui lòng đăng nhập để chia sẻ"}
              value={shareText}
              onChange={(e) => {
                setShareText(e.target.value);
                setError('');
              }}
              disabled={!isLoggedIn || isPosting}
            />
            <label className="image-upload-label" htmlFor="image-upload">
              <FaImage className="upload-icon" />
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={!isLoggedIn || isPosting}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              onClick={handleShareSubmit} 
              disabled={!isLoggedIn || isPosting}
            >
              {isPosting ? '...' : '+'}
            </button>
          </div>
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
              <button className="remove-image" onClick={removeImage}>
                <FaTimes />
              </button>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <div className="community-tabs">
        <button
          className={activeTab === 'recent' ? 'active' : ''}
          onClick={() => setActiveTab('recent')}
        >
          Gần đây
        </button>
        <button
          className={activeTab === 'newest' ? 'active' : ''}
          onClick={() => setActiveTab('newest')}
        >
          Mới nhất
        </button>
        {isLoggedIn && (
          <button
            className={activeTab === 'my-posts' ? 'active' : ''}
            onClick={() => setActiveTab('my-posts')}
          >
            Bài viết của bạn
          </button>
        )}
      </div>

      <div className="community-posts">
        {filterPosts().map((post, index) => (
          <div key={post.id || index} className="post-card">
            <div className="quote-icon"><FaQuoteLeft /></div>
            <p className="post-content">{post.content}</p>
            {post.imageUrl && (
              <div className="post-image">
                <img src={post.imageUrl} alt="Post content" />
              </div>
            )}
            <div className="post-author-info">
              <img 
                src={users[post.userId]?.image || 'https://via.placeholder.com/40'} 
                alt="User Avatar" 
                className="author-avatar" 
              />
              <div className="author-details">
                <span className="author-name">{users[post.userId]?.fullName || 'Đang tải...'}</span>
                <span className="author-role">Thành viên cộng đồng</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;