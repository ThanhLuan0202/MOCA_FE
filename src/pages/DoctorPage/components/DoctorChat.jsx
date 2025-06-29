import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPaperPlane, FaCircle, FaRegPaperPlane } from 'react-icons/fa';
import * as signalR from '@microsoft/signalr';
import apiClient from '../../../services/api';
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../components/CustomModal';

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
  const navigate = useNavigate();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showMomProfileModal, setShowMomProfileModal] = useState(false);
  const [momProfileStatus, setMomProfileStatus] = useState('');
  const [loadingMomProfile, setLoadingMomProfile] = useState(false);
  const [momProfileData, setMomProfileData] = useState(null);
  const [pregnancyTracking, setPregnancyTracking] = useState([]);
  const [babyTracking, setBabyTracking] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

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
        const allContacts = Array.isArray(data) ? data : data?.$values || [];
        setContacts(allContacts.filter(c => c.status === 'Active'));
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

  const handleCompleteConsult = async () => {
    if (!selectedContact?.contactId) return;
    try {
      await apiClient.get(`https://moca.mom:2030/api/DoctorContact/${selectedContact.contactId}`);
      setShowCompleteModal(false);
    } catch (e) {
      alert('Có lỗi khi xác nhận hoàn thành!');
    }
  };

  // Helper: always return array
  const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.$values)) return data.$values;
    return [data];
  };

  const handleViewMomProfile = async (userId) => {
    setLoadingMomProfile(true);
    setActiveTab('profile');
    try {
      const checkResponse = await axios.get(`https://moca.mom:2030/api/MomProfile/CheckMom2?userId=${userId}`, {
        withCredentials: true,
      });
      if (checkResponse.data === 'Is Not Mom') {
        setMomProfileStatus('Người dùng không có hồ sơ thai phụ');
        setMomProfileData(null);
        setPregnancyTracking([]);
        setBabyTracking([]);
        setShowMomProfileModal(true);
      } else if (checkResponse.data === 'Is Mom') {
        // Lấy thông tin thai phụ
        const profileResponse = await axios.get(`https://moca.mom:2030/api/MomProfile/MomInputId2?userId=${userId}`, {
          withCredentials: true,
        });
        setMomProfileData(profileResponse.data);
        // Lấy worksheet (theo dõi thai kỳ)
        const worksheetRes = await axios.get(`https://moca.mom:2030/api/PregnancyTracking/GetPregnancyTrackingByUserId2?userId=${userId}`, {
          withCredentials: true,
        });
        setPregnancyTracking(toArray(worksheetRes.data));
        // Lấy baby tracking (theo dõi em bé)
        const babyRes = await axios.get(`https://moca.mom:2030/api/BabayTracking/GetBabyTrackingByUserId2?userId=${userId}`, {
          withCredentials: true,
        });
        setBabyTracking(toArray(babyRes.data));
        setShowMomProfileModal(true);
      } else {
        setMomProfileStatus('Phản hồi không xác định từ server');
        setMomProfileData(null);
        setPregnancyTracking([]);
        setBabyTracking([]);
        setShowMomProfileModal(true);
      }
    } catch (error) {
      setMomProfileStatus('Có lỗi khi kiểm tra hồ sơ thai phụ: ' + error.message);
      setMomProfileData(null);
      setPregnancyTracking([]);
      setBabyTracking([]);
      setShowMomProfileModal(true);
    } finally {
      setLoadingMomProfile(false);
    }
  };

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
                  {/* Nút xem hồ sơ thai phụ */}
                  {currentUser?.roleId === 4 && selectedContact.userId && (
                    <>
                      <button
                        style={{marginLeft: 16, background: '#6a5af9', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 500, cursor: 'pointer'}}
                        onClick={() => handleViewMomProfile(selectedContact.userId)}
                        disabled={loadingMomProfile}
                      >
                        {loadingMomProfile ? 'Đang tải...' : 'Xem hồ sơ thai phụ'}
                      </button>
                      <button
                        style={{marginLeft: 12, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, cursor: 'pointer'}}
                        onClick={() => setShowCompleteModal(true)}
                      >
                        Hoàn thành
                      </button>
                    </>
                  )}
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
            {showCompleteModal && (
              <CustomModal title="Xác nhận hoàn thành tư vấn" onClose={() => setShowCompleteModal(false)}>
                <div style={{textAlign: 'center', marginBottom: 18}}>Bạn đã hoàn thành buổi tư vấn?</div>
                <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
                  <button className="cancel-btn" style={{padding: '8px 22px'}} onClick={() => setShowCompleteModal(false)}>Huỷ</button>
                  <button className="submit-btn" style={{padding: '8px 28px'}} onClick={handleCompleteConsult}>Xác nhận</button>
                </div>
              </CustomModal>
            )}
            {showMomProfileModal && (
              <CustomModal title={momProfileData ? 'Thông tin thai phụ' : 'Thông báo'} onClose={() => { setShowMomProfileModal(false); setMomProfileData(null); setPregnancyTracking([]); setBabyTracking([]); }}>
                {momProfileData ? (
                  <div style={{padding: 0, minWidth: 400, maxWidth: 600, fontFamily: 'Segoe UI, Arial, sans-serif'}}>
                    {/* Tab header */}
                    <div style={{display: 'flex', borderBottom: '2px solid #e0e0e0', marginBottom: 24, background: '#f7f7fb', borderRadius: '12px 12px 0 0', overflow: 'hidden'}}>
                      <button onClick={() => setActiveTab('profile')} style={{flex: 1, padding: 18, background: activeTab==='profile'?'#6a5af9':'#f7f7fb', color: activeTab==='profile'?'#fff':'#333', border: 'none', fontWeight: 700, fontSize: 18, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab==='profile'?'0 2px 8px #6a5af933':'none'}}>
                        Hồ sơ thai phụ
                      </button>
                      <button onClick={() => setActiveTab('worksheet')} style={{flex: 1, padding: 18, background: activeTab==='worksheet'?'#6a5af9':'#f7f7fb', color: activeTab==='worksheet'?'#fff':'#333', border: 'none', fontWeight: 700, fontSize: 18, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab==='worksheet'?'0 2px 8px #6a5af933':'none'}}>
                        Theo dõi thai kỳ
                      </button>
                      <button onClick={() => setActiveTab('baby')} style={{flex: 1, padding: 18, background: activeTab==='baby'?'#6a5af9':'#f7f7fb', color: activeTab==='baby'?'#fff':'#333', border: 'none', fontWeight: 700, fontSize: 18, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab==='baby'?'0 2px 8px #6a5af933':'none'}}>
                        Theo dõi em bé
                      </button>
                    </div>
                    {/* Tab content */}
                    {activeTab === 'profile' && (
                      <div style={{padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', marginBottom: 8}}>
                        <div style={{textAlign: 'center', marginBottom: 24}}>
                          <img
                            src={momProfileData.user?.image}
                            alt={momProfileData.user?.fullName}
                            style={{width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 12px #aaa'}}
                          />
                        </div>
                        <div style={{marginBottom: 16, fontSize: 20}}><strong>Họ và tên:</strong> {momProfileData.user?.fullName || 'Chưa cập nhật'}</div>
                        <div style={{marginBottom: 16, fontSize: 18}}><strong>Ngày sinh:</strong> {momProfileData.dateOfBirth || 'Chưa cập nhật'}</div>
                        <div style={{marginBottom: 16, fontSize: 18}}><strong>Tình trạng hôn nhân:</strong> {momProfileData.maritalStatus || 'Chưa cập nhật'}</div>
                        <div style={{marginBottom: 16, fontSize: 18}}><strong>Nhóm máu:</strong> {momProfileData.bloodType || 'Chưa cập nhật'}</div>
                        <div style={{marginBottom: 16, fontSize: 18}}><strong>Tiền sử bệnh lý:</strong> {momProfileData.medicalHistory || 'Không có'}</div>
                      </div>
                    )}
                    {activeTab === 'worksheet' && (
                      <div style={{padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', marginBottom: 8}}>
                        <div style={{fontWeight: 700, fontSize: 20, marginBottom: 18, color: '#6a5af9'}}>Theo dõi thai kỳ</div>
                        <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fafaff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px #eee', fontSize: 17}}>
                          <thead style={{background: '#ede9fe'}}>
                            <tr>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Ngày theo dõi</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Tuần thai</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Cân nặng</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Vòng bụng</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Huyết áp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(pregnancyTracking) && pregnancyTracking.length === 0 ? (
                              <tr><td colSpan={5} style={{textAlign: 'center', color: '#888', padding: 18, fontSize: 17}}>Không có dữ liệu</td></tr>
                            ) : Array.isArray(pregnancyTracking) && pregnancyTracking.map((item, idx) => (
                              <tr key={idx} style={{background: idx%2===0?'#f7f7fb':'#fff'}}>
                                <td style={{padding: 14}}>{item.trackingDate ? new Date(item.trackingDate).toLocaleDateString() : ''}</td>
                                <td style={{padding: 14}}>{item.weekNumber || ''}</td>
                                <td style={{padding: 14}}>{item.weight || ''}</td>
                                <td style={{padding: 14}}>{item.bellySize || ''}</td>
                                <td style={{padding: 14}}>{item.bloodPressure || ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeTab === 'baby' && (
                      <div style={{padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e0e0e0', marginBottom: 8}}>
                        <div style={{fontWeight: 700, fontSize: 20, marginBottom: 18, color: '#6a5af9'}}>Theo dõi em bé</div>
                        <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fafaff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px #eee', fontSize: 17}}>
                          <thead style={{background: '#ede9fe'}}>
                            <tr>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Ngày khám</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Nhịp tim thai</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Cân nặng ước tính</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Chỉ số ối</th>
                              <th style={{padding: 14, borderBottom: '2px solid #d1d5db', fontWeight: 700}}>Vị trí nhau</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(babyTracking) && babyTracking.length === 0 ? (
                              <tr><td colSpan={5} style={{textAlign: 'center', color: '#888', padding: 18, fontSize: 17}}>Không có dữ liệu</td></tr>
                            ) : Array.isArray(babyTracking) && babyTracking.map((item, idx) => (
                              <tr key={idx} style={{background: idx%2===0?'#f7f7fb':'#fff'}}>
                                <td style={{padding: 14}}>{item.checkupDate ? new Date(item.checkupDate).toLocaleDateString() : ''}</td>
                                <td style={{padding: 14}}>{item.fetalHeartRate || ''}</td>
                                <td style={{padding: 14}}>{item.estimatedWeight || ''}</td>
                                <td style={{padding: 14}}>{item.amnioticFluidIndex || ''}</td>
                                <td style={{padding: 14}}>{item.placentaPosition || ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{padding: '20px', minWidth: 220, textAlign: 'center'}}>{momProfileStatus}</div>
                )}
                <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24}}>
                  <button className="submit-btn" style={{padding: '12px 36px', fontSize: 18, borderRadius: 8, background: '#6a5af9', color: '#fff', fontWeight: 700, border: 'none', boxShadow: '0 2px 8px #6a5af933', cursor: 'pointer'}} onClick={() => { setShowMomProfileModal(false); setMomProfileData(null); setPregnancyTracking([]); setBabyTracking([]); }}>Đóng</button>
                </div>
              </CustomModal>
            )}
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