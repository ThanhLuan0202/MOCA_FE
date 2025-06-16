import React, { useState } from 'react';
import './CommunityPage.scss';
import { FaQuoteLeft, FaEnvelope } from 'react-icons/fa'; // Import icons

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent', 'newest', 'my-posts'
  const [shareText, setShareText] = useState('');

  // Dummy data for posts, replace with actual data from API later
  const posts = [
    {
      id: 1,
      content: 'Điều mình thích nhất là các bài viết được kiểm duyệt bởi chuyên gia, giúp mình an tâm khi áp dụng vào thực tế. Không còn phải lo lắng về những thông tin không chính xác trên mạng nữa!',
      author: 'Nguyễn Thu Hương',
      role: 'Nhân viên văn phòng',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 2,
      content: 'Ứng dụng AI hỗ trợ rất thông minh, mình chỉ cần nhập tình trạng sức khỏe và nhận được tư vấn nhanh chóng. Cảm giác như có một bác sĩ riêng bên cạnh vậy!',
      author: 'Lê Thanh Thủy',
      role: 'Sinh viên đại học',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 3,
      content: 'Trang web này thực sự hữu ích! Mình đặc biệt thích tính năng theo dõi thai kỳ và nhận lời khuyên cá nhân hóa từ AI. Mọi thông tin đều rất dễ hiểu và khoa học!',
      author: 'Nguyễn Thanh Hằng',
      role: 'Giảng viên đại học',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 4,
      content: 'Anonymity helped me seek help. The service matched me with a caring therapist.',
      author: 'Serly Clanita',
      role: 'Student, University of Harvard',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 5,
      content: 'Vợ mình sử dụng website này hàng ngày và rất hài lòng. Mình thấy đây là một công cụ tuyệt vời giúp mẹ bầu có thai kỳ an toàn và khỏe mạnh.',
      author: 'Trần Quang Dũng',
      role: 'Giám đốc ngân hàng',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: 6,
      content: 'Lần đầu làm mẹ, mình rất lo lắng, nhưng nhờ trang web này mà mình cảm thấy yên tâm hơn. Các bài viết định hướng và tập luyện giúp mình có một thai kỳ khỏe mạnh.',
      author: 'Trần Minh Khuê',
      role: 'Quản lý dự án',
      avatar: 'https://via.placeholder.com/40',
    },
  ];

  const handleShareSubmit = () => {
    console.log('Share content:', shareText);
    // Implement sharing logic here
    setShareText('');
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Cộng đồng chia sẻ dành cho các mẹ bầu</h1>
        <p>Hãy để lại những chia sẻ của bạn dành cho các mẹ bầu</p>
        <div className="share-input-container">
          <input
            type="text"
            placeholder="Hãy chia sẻ cho chúng tôi"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
          />
          <button onClick={handleShareSubmit}>+</button>
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
        <button
          className={activeTab === 'my-posts' ? 'active' : ''}
          onClick={() => setActiveTab('my-posts')}
        >
          Bài viết của bạn
        </button>
      </div>

      <div className="community-posts">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="quote-icon"><FaQuoteLeft /></div>
            <p className="post-content">{post.content}</p>
            <div className="post-author-info">
              <img src={post.avatar} alt={post.author} className="author-avatar" />
              <div className="author-details">
                <span className="author-name">{post.author}</span>
                <span className="author-role">{post.role}</span>
              </div>
              <FaEnvelope className="email-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;