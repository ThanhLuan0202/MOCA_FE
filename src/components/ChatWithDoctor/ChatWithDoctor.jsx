import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import axios from "axios";

const API_BASE = "https://moca.mom:2030/api/ChatDoctor";

const ChatWithDoctor = () => {
  const { currentUser: user, isLoggedIn } = useAuth();
  const token = localStorage.getItem("authToken");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch danh sách bác sĩ đã chat
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDoctors(res.data?.$values || []);
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
      .withUrl("/chatHub", {
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

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedDoctor) return;
    try {
      await axios.post(
        `${API_BASE}/messages`,
        {
          contactId: selectedDoctor.contactId,
          messageText: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Fetch lại messages sau khi gửi
      const res = await axios.get(`${API_BASE}/messages/${selectedDoctor.contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data?.$values || []);
      setNewMessage("");
    } catch (err) {
      alert("Gửi tin nhắn thất bại");
    }
  };

  return (
    <div className="chat-with-doctor-container flex h-[80vh] border rounded shadow-lg">
      {/* Danh sách bác sĩ */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 font-bold text-lg text-pink-600 border-b bg-pink-50">Bác sĩ của bạn</h2>
        {doctors.length === 0 ? (
          <div className="p-4 text-gray-500">Chưa có cuộc trò chuyện nào</div>
        ) : (
          doctors.map((contact) => (
            <div
              key={contact.contactId}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors rounded-lg mb-2 mx-2 
                ${selectedDoctor?.contactId === contact.contactId ? "bg-pink-100 border border-pink-300 shadow" : "hover:bg-gray-100"}`}
              onClick={() => setSelectedDoctor(contact)}
            >
              <div className="w-12 h-12 bg-pink-200 flex items-center justify-center rounded-full text-xl font-bold text-white">
                {contact.doctor?.name ? contact.doctor.name.charAt(0) : contact.doctorId}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-base">
                  {contact.doctor?.name || `Bác sĩ #${contact.doctorId}`}
                </span>
                <span className="text-xs text-gray-500">ID: {contact.doctorId}</span>
              </div>
            </div>
          ))
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
                  className={`mb-2 flex ${msg.senderType === "User" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-xs shadow 
                      ${msg.senderType === "User" ? "bg-pink-500 text-white ml-auto" : "bg-white text-gray-800 mr-auto border"}`}
                  >
                    {msg.messageText}
                    <div className="text-xs text-gray-400 mt-1">{new Date(msg.sendAt).toLocaleString()}</div>
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
    </div>
  );
};

export default ChatWithDoctor; 