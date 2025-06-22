import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPaperPlane, FaCircle, FaRegPaperPlane } from 'react-icons/fa';
import * as signalR from '@microsoft/signalr';
import apiClient from '../../../services/api';
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";

const USER_API = "https://moca.mom:2030/api/User";

const DoctorChat = () => {
  const { currentUser } = useAuth();
  const [doctorId, setDoctorId] = useState(null); // Thêm state doctorId
  const [contacts, setContacts] = useState([]); // Danh sách cuộc trò chuyện
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [messages, setMessages] = useState([]); // Tin nhắn của contact đang chọn
  const [connection, setConnection] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [token, setToken] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [userProfiles, setUserProfiles] = useState({}); // Lưu cache profile user

  // Lấy doctorId khi mount
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const data = await apiClient.get('/api/DoctorProfile/DoctorByUserId');
        setDoctorId(data.doctorId); // Đảm bảo data.doctorId là số hoặc string số
      } catch (err) {
        setDoctorId(null);
      }
    };
    fetchDoctorId();
  }, []);

  // Lấy danh sách contact khi có doctorId
  useEffect(() => {
    if (!doctorId) return;
    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        const data = await apiClient.get('/api/ChatDoctor/contacts');
        // Log để kiểm tra
        console.log("Contacts API response:", data);
        setContacts(Array.isArray(data) ? data : data?.$values || []);
      } catch (err) {
        setContacts([]);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, [doctorId]);

  // Lấy lịch sử tin nhắn khi chọn contact
  useEffect(() => {
    if (!selectedContactId || !token) return;
    setLoadingMessages(true);
    apiClient.get(`/api/ChatDoctor/messages/${selectedContactId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        console.log('Messages API full response:', res);
        console.log('Messages API res.data:', res.data);
        setMessages(res.data?.$values || res.$values || []);
        console.log('Set messages:', res.data?.$values || res.$values || []);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [selectedContactId, token]);

  useEffect(() => {
    console.log('selectedContactId changed:', selectedContactId);
  }, [selectedContactId]);

  // Kết nối SignalR khi chọn contact
  useEffect(() => {
    if (!selectedContactId) return;
    const token = localStorage.getItem('authToken');
    setToken(token);
    const conn = new signalR.HubConnectionBuilder()
      .withUrl('https://moca.mom:2030/chatHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
    setConnection(conn);
    conn.start()
      .then(() => {
        conn.invoke('JoinContact', selectedContactId);
      })
      .catch(err => console.error('SignalR Connection Error:', err));
    conn.on('ReceiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      conn.invoke('LeaveContact', selectedContactId).catch(() => {});
      conn.stop();
    };
  }, [selectedContactId]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact || !connection) return;
    try {
      await connection.invoke('SendMessage', selectedContact.contactId, newMessage);
      setNewMessage("");
    } catch (err) {
      alert("Gửi tin nhắn thất bại");
    }
  };

  // Xác định tên, avatar, ... của contact đang chọn
  useEffect(() => {
    if (selectedContactId) {
      const contact = contacts.find(c => c.contactId === selectedContactId);
      setSelectedContact(contact);
    }
  }, [selectedContactId, contacts]);

  // Fetch profile user nếu chưa có
  const fetchUserProfile = async (userId) => {
    if (!userId || userProfiles[userId]) return;
    try {
      const res = await axios.get(`${USER_API}/${userId}`);
      setUserProfiles((prev) => ({ ...prev, [userId]: res.data }));
    } catch {}
  };

  // Khi danh sách contacts thay đổi, fetch profile cho các user chưa có
  useEffect(() => {
    contacts.forEach((contact) => {
      if (!contact.user && contact.userId) {
        fetchUserProfile(contact.userId);
      }
    });
    // eslint-disable-next-line
  }, [contacts]);

  console.log('Header currentUser:', currentUser);
  console.log('Messages state:', messages);
  console.log('Render messages:', messages);

  return (
    <div style={{display: 'flex', height: '80vh', background: '#18191a', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.15)'}}>
      {/* LEFT: Conversation List */}
      <div style={{width: 340, background: '#242526', color: '#fff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333'}}>
        <div style={{padding: 16, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 8}}>
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." style={{width: '100%', border: 'none', background: '#3a3b3c', color: '#fff', borderRadius: 8, padding: 8}} />
        </div>
        <div style={{flex: 1, overflowY: 'auto'}}>
          {loadingContacts ? <div style={{padding: 24, color: '#aaa'}}>Đang tải...</div> :
            contacts.length === 0 ? <div style={{padding: 24, color: '#aaa'}}>Không có cuộc trò chuyện</div> :
            contacts.map(conv => {
              const profile = userProfiles[conv.userId];
              return (
                <div
                  key={conv.contactId}
                  style={{
                    display: 'flex', alignItems: 'center', padding: 14, cursor: 'pointer',
                    background: conv.contactId === selectedContactId ? '#393a3b' : 'none', borderBottom: '1px solid #333'
                  }}
                  onClick={() => setSelectedContactId(conv.contactId)}
                >
                  <img src={profile?.image || 'https://randomuser.me/api/portraits/men/75.jpg'} alt={profile?.fullName || conv.userId} style={{width: 48, height: 48, borderRadius: '50%', marginRight: 14, objectFit: 'cover'}} />
                  <div style={{flex: 1, overflow: 'hidden'}}>
                    <div style={{fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{profile?.fullName || conv.userId}</div>
                    <div style={{fontSize: 13, color: '#b0b3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{conv.lastMessage || ''}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* RIGHT: Chat Area */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: '#242526'}}>
        {selectedContact ? (
          <>
            {/* Header */}
            {(() => {
              const profile = userProfiles[selectedContact.userId];
              return (
                <div style={{display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #333', background: '#242526'}}>
                  <img src={profile?.image || 'https://randomuser.me/api/portraits/men/75.jpg'} alt={profile?.fullName || selectedContact.userId} style={{width: 40, height: 40, borderRadius: '50%', marginRight: 14, objectFit: 'cover'}} />
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>{profile?.fullName || selectedContact.userId}</div>
                    <div style={{fontSize: 13, color: '#44e36a', display: 'flex', alignItems: 'center', gap: 6}}><FaCircle style={{fontSize: 10}}/> Online</div>
                  </div>
                </div>
              );
            })()}
            {/* Message Area */}
            <div style={{flex: 1, padding: 24, overflowY: 'auto', background: '#18191a', display: 'flex', flexDirection: 'column', gap: 12}}>
              {loadingMessages ? <div style={{color: '#aaa'}}>Đang tải tin nhắn...</div> :
                messages.length === 0 ? <div style={{color: '#aaa'}}>Chưa có tin nhắn</div> :
                messages.map((msg, idx) => (
                  <div key={msg.messageId || idx} style={{display: 'flex', justifyContent: msg.senderType === 'Doctor' ? 'flex-end' : 'flex-start'}}>
                    <div style={{
                      background: msg.senderType === 'Doctor' ? 'linear-gradient(90deg,#6a5af9 60%,#8f6aff 100%)' : '#3a3b3c',
                      color: msg.senderType === 'Doctor' ? '#fff' : '#e4e6eb',
                      borderRadius: 18,
                      padding: '10px 18px',
                      maxWidth: 380,
                      fontSize: 15,
                      boxShadow: msg.senderType === 'Doctor' ? '0 2px 8px #6a5af933' : '0 1px 4px #0002',
                      marginLeft: msg.senderType === 'Doctor' ? 40 : 0,
                      marginRight: msg.senderType === 'Doctor' ? 0 : 40,
                      textAlign: 'left',
                      position: 'relative',
                    }}>
                      {msg.messageText}
                      <div style={{fontSize: 11, color: '#b0b3b8', marginTop: 6, textAlign: msg.senderType === 'Doctor' ? 'right' : 'left'}}>
                        {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ''}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div style={{display: 'flex', alignItems: 'center', padding: 18, borderTop: '1px solid #333', background: '#242526'}}>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                style={{flex: 1, border: 'none', background: '#3a3b3c', color: '#fff', borderRadius: 18, padding: '12px 18px', fontSize: 15, marginRight: 12}}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              />
              {currentUser?.roleId === 3 || currentUser?.roleId === 5 ? (
                <button
                  style={{background: 'linear-gradient(90deg,#6a5af9 60%,#8f6aff 100%)', color: '#fff', border: 'none', borderRadius: 18, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                >
                  <FaRegPaperPlane className="icon" />
                  Gửi
                </button>
              ) : null}
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