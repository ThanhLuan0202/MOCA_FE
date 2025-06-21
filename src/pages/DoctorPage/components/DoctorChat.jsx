import React, { useState } from 'react';
import { FaSearch, FaPaperPlane, FaCircle } from 'react-icons/fa';

const conversations = [
  { id: 1, name: 'Nguyễn Thị An', lastMessage: 'Chào bác sĩ, em có câu hỏi ạ...', time: '10:45 AM', avatar: 'https://randomuser.me/api/portraits/women/75.jpg', unread: 2 },
  { id: 2, name: 'Trần Văn Bình', lastMessage: 'Cảm ơn bác sĩ nhiều!', time: 'Hôm qua', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', unread: 0 },
  { id: 3, name: 'Lê Thị Cẩm', lastMessage: 'Vâng ạ, em hiểu rồi.', time: 'Hôm qua', avatar: 'https://randomuser.me/api/portraits/women/76.jpg', unread: 0 },
];

const messagesData = {
  1: [
    { id: 1, sender: 'other', text: 'Chào bác sĩ, em có câu hỏi ạ về kết quả siêu âm hôm qua.', time: '10:45 AM' },
    { id: 2, sender: 'me', text: 'Chào em, em cứ hỏi đi nhé.', time: '10:46 AM' },
    { id: 3, sender: 'other', text: 'Em thấy có chỉ số hơi thấp, có sao không ạ?', time: '10:47 AM' },
    { id: 4, sender: 'me', text: 'Em gửi ảnh kết quả để bác sĩ xem nhé!', time: '10:48 AM' },
  ],
  2: [
    { id: 1, sender: 'other', text: 'Cảm ơn bác sĩ nhiều!', time: 'Hôm qua' },
    { id: 2, sender: 'me', text: 'Không có gì nhé, chúc bạn sức khỏe!', time: 'Hôm qua' },
  ],
  3: [
    { id: 1, sender: 'other', text: 'Vâng ạ, em hiểu rồi.', time: 'Hôm qua' },
    { id: 2, sender: 'me', text: 'Có gì cần hỏi thêm cứ nhắn nhé!', time: 'Hôm qua' },
  ],
};

const DoctorChat = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedConversation = conversations.find(c => c.id === selectedId);
  const messages = selectedId ? messagesData[selectedId] || [] : [];

  return (
    <div style={{display: 'flex', height: '80vh', background: '#18191a', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.15)'}}>
      {/* LEFT: Conversation List */}
      <div style={{width: 340, background: '#242526', color: '#fff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333'}}>
        <div style={{padding: 16, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 8}}>
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." style={{width: '100%', border: 'none', background: '#3a3b3c', color: '#fff', borderRadius: 8, padding: 8}} />
        </div>
        <div style={{flex: 1, overflowY: 'auto'}}>
          {conversations.map(conv => (
            <div
              key={conv.id}
              style={{
                display: 'flex', alignItems: 'center', padding: 14, cursor: 'pointer',
                background: conv.id === selectedId ? '#393a3b' : 'none', borderBottom: '1px solid #333'
              }}
              onClick={() => setSelectedId(conv.id)}
            >
              <img src={conv.avatar} alt={conv.name} style={{width: 48, height: 48, borderRadius: '50%', marginRight: 14}} />
              <div style={{flex: 1, overflow: 'hidden'}}>
                <div style={{fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{conv.name}</div>
                <div style={{fontSize: 13, color: '#b0b3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{conv.lastMessage}</div>
              </div>
              <div style={{textAlign: 'right', minWidth: 60}}>
                <div style={{fontSize: 12, color: '#b0b3b8'}}>{conv.time}</div>
                {conv.unread > 0 && <span style={{background: '#e41e3f', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 12, padding: '2px 8px', marginTop: 4, display: 'inline-block'}}> {conv.unread} </span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* RIGHT: Chat Area */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: '#242526'}}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div style={{display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #333', background: '#242526'}}>
              <img src={selectedConversation.avatar} alt={selectedConversation.name} style={{width: 40, height: 40, borderRadius: '50%', marginRight: 14}} />
              <div style={{flex: 1}}>
                <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>{selectedConversation.name}</div>
                <div style={{fontSize: 13, color: '#44e36a', display: 'flex', alignItems: 'center', gap: 6}}><FaCircle style={{fontSize: 10}}/> Online</div>
              </div>
            </div>
            {/* Message Area */}
            <div style={{flex: 1, padding: 24, overflowY: 'auto', background: '#18191a', display: 'flex', flexDirection: 'column', gap: 12}}>
              {messages.map(msg => (
                <div key={msg.id} style={{display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start'}}>
                  <div style={{
                    background: msg.sender === 'me' ? 'linear-gradient(90deg,#6a5af9 60%,#8f6aff 100%)' : '#3a3b3c',
                    color: msg.sender === 'me' ? '#fff' : '#e4e6eb',
                    borderRadius: 18,
                    padding: '10px 18px',
                    maxWidth: 380,
                    fontSize: 15,
                    boxShadow: msg.sender === 'me' ? '0 2px 8px #6a5af933' : '0 1px 4px #0002',
                    marginLeft: msg.sender === 'me' ? 40 : 0,
                    marginRight: msg.sender === 'me' ? 0 : 40,
                    textAlign: 'left',
                    position: 'relative',
                  }}>
                    {msg.text}
                    <div style={{fontSize: 11, color: '#b0b3b8', marginTop: 6, textAlign: msg.sender === 'me' ? 'right' : 'left'}}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div style={{display: 'flex', alignItems: 'center', padding: 18, borderTop: '1px solid #333', background: '#242526'}}>
              <input type="text" placeholder="Nhập tin nhắn..." style={{flex: 1, border: 'none', background: '#3a3b3c', color: '#fff', borderRadius: 18, padding: '12px 18px', fontSize: 15, marginRight: 12}} />
              <button style={{background: 'linear-gradient(90deg,#6a5af9 60%,#8f6aff 100%)', color: '#fff', border: 'none', borderRadius: 18, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}>
                <FaPaperPlane />
                Gửi
              </button>
            </div>
          </>
        ) : (
          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0b3b8', fontSize: 20}}>
            Hãy chọn một cuộc trò chuyện để bắt đầu nhắn tin
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat; 