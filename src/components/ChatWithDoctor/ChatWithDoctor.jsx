import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axios from "axios";

const API_BASE = "https://moca.mom:2030/api/ChatDoctor";
const USER_API = "https://moca.mom:2030/api/User";

const ChatWithDoctor = () => {
  const { currentUser: user, isLoggedIn } = useAuth();
  const token = localStorage.getItem("authToken");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);
  const [doctorProfiles, setDoctorProfiles] = useState({});

  // Fetch danh sách bác sĩ đã chat
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const allContacts = res.data?.$values || [];
        setDoctors(allContacts.filter(c => c.status === 'Active'));
      });
  }, [token]);

  // Fetch lịch sử chat khi chọn bác sĩ
  useEffect(() => {
    if (!selectedDoctor || !token) return;
    axios
      .get(`${API_BASE}/messages/${selectedDoctor.contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data?.$values || []);
      });
  }, [selectedDoctor, token]);

  // Kết nối SignalR
  useEffect(() => {
    if (!token) return;
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://moca.mom:2030/chatHub", {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (!connection) return;
    connection.start().then(() => {
      connection.on("ReceiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });
    });
    return () => {
      connection.stop();
    };
  }, [connection]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join group khi chọn bác sĩ
  useEffect(() => {
    if (!selectedDoctor || !connection) return;
    connection.invoke('JoinContact', selectedDoctor.contactId);
    return () => {
      connection.invoke('LeaveContact', selectedDoctor.contactId).catch(() => {});
    };
  }, [selectedDoctor, connection]);

  // Gửi tin nhắn qua SignalR
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedDoctor || !connection) return;
    try {
      await connection.invoke('SendMessage', selectedDoctor.contactId, newMessage);
      setNewMessage("");
    } catch (err) {
      alert("Gửi tin nhắn thất bại");
    }
  };

  // Fetch profile bác sĩ nếu chưa có
  const fetchDoctorProfile = async (doctorId) => {
    if (!doctorId || doctorProfiles[doctorId]) return;
    try {
      const res = await axios.get(`${USER_API}/${doctorId}`);
      setDoctorProfiles((prev) => ({ ...prev, [doctorId]: res.data }));
    } catch {}
  };

  // Khi danh sách doctors thay đổi, fetch profile cho các doctor chưa có
  useEffect(() => {
    doctors.forEach((contact) => {
      if (!contact.doctor && contact.doctorId) {
        fetchDoctorProfile(contact.doctorId);
      }
    });
    // eslint-disable-next-line
  }, [doctors]);

  return (
    <div className="chat-with-doctor-container flex h-[80vh] border rounded shadow-lg">
      {/* Danh sách bác sĩ */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 font-bold text-lg text-pink-600 border-b bg-pink-50">Bác sĩ của bạn</h2>
        {doctors.length === 0 ? (
          <div className="p-4 text-gray-500">Chưa có cuộc trò chuyện nào</div>
        ) : (
          doctors.map((contact) => {
            const profile = doctorProfiles[contact.doctorId];
            return (
              <div
                key={contact.contactId}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors rounded-lg mb-2 mx-2 
                  ${selectedDoctor?.contactId === contact.contactId ? "bg-pink-100 border border-pink-300 shadow" : "hover:bg-gray-100"}`}
                onClick={() => setSelectedDoctor(contact)}
              >
                <div className="w-12 h-12 bg-pink-200 flex items-center justify-center rounded-full text-xl font-bold text-white overflow-hidden">
                  {profile?.image ? (
                    <img src={profile.image} alt={profile.fullName} className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    contact.doctor?.name ? contact.doctor.name.charAt(0) : contact.doctorId
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-base">
                    {profile?.fullName || contact.doctor?.name || `Bác sĩ #${contact.doctorId}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Khung chat */}
      <div className="flex-1 flex flex-col bg-gray-50 rounded-r-lg">
        <div className="flex-1 overflow-y-auto p-4">
          {selectedDoctor ? (
            messages.length === 0 ? (
              <div className="text-gray-500">Chưa có tin nhắn nào</div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg.messageId || idx}
                  className={`flex w-full mb-3 ${msg.senderType === "User" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      `chat-bubble ${msg.senderType === "User" ? "user-bubble" : "doctor-bubble"}`
                    }
                  >
                    {msg.messageText}
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="text-gray-500">Chọn bác sĩ để bắt đầu chat</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Nhập tin nhắn */}
        {selectedDoctor && (
          <div className="p-4 border-t flex gap-2 bg-white rounded-b-lg">
            <input
              className="flex-1 border rounded px-3 py-2"
              type="text"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        )}
      </div>
      {/* Thêm style inline cho chat bubble đẹp hơn */}
      <style>{`
        .chat-bubble {
          padding: 12px 18px;
          border-radius: 22px;
          max-width: 70%;
          font-size: 16px;
          line-height: 1.6;
          box-shadow: 0 2px 8px #fbb6ce33;
          margin-bottom: 2px;
          word-break: break-word;
          display: inline-block;
          position: relative;
          margin-left: 6px;
          margin-right: 6px;
        }
        .user-bubble {
          background: linear-gradient(90deg,#f472b6 60%,#fb7185 100%);
          color: #fff;
          margin-left: auto;
          border-bottom-right-radius: 6px;
          border-top-right-radius: 22px;
          border-top-left-radius: 22px;
          border-bottom-left-radius: 22px;
        }
        .doctor-bubble {
          background: #fff;
          color: #222;
          border: 1.5px solid #fbb6ce;
          margin-right: auto;
          border-bottom-left-radius: 6px;
          border-top-right-radius: 22px;
          border-top-left-radius: 22px;
          border-bottom-right-radius: 22px;
        }
        .chat-with-doctor-container input[type="text"] {
          font-size: 16px;
          border: 1.5px solid #fbb6ce;
          border-radius: 18px;
          padding: 12px 18px;
          background: #fff;
          transition: border 0.2s;
          outline: none;
        }
        .chat-with-doctor-container input[type="text"]:focus {
          border: 1.5px solid #fb7185;
          box-shadow: 0 2px 8px #fbb6ce33;
        }
        .chat-with-doctor-container button {
          font-size: 16px;
          font-weight: 600;
          border-radius: 18px;
          padding: 10px 28px;
          background: linear-gradient(90deg,#fb7185 60%,#f472b6 100%);
          color: #fff;
          border: none;
          box-shadow: 0 2px 8px #fbb6ce33;
          transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
          cursor: pointer;
        }
        .chat-with-doctor-container button:hover {
          background: linear-gradient(90deg,#f472b6 60%,#fb7185 100%);
          box-shadow: 0 4px 16px #fbb6ce33;
          transform: translateY(-2px) scale(1.03);
        }
      `}</style>
    </div>
  );
};

export default ChatWithDoctor; 