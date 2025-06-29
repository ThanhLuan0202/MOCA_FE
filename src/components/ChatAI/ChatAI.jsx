import React, { useState, useEffect } from "react";
import "./ChatAI.css"; 
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/api";
import axios from "axios";

const ChatAI = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { isLoggedIn } = useAuth();
  const [hasChatAIPackage, setHasChatAIPackage] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    axios.get("https://moca.mom:2030/api/PurchasedPackage/GetEnroll", { withCredentials: true })
      .then(res => {
        const values = res?.data?.$values || [];
        const hasChatAI = values.some(pkg => pkg?.package?.packageName === "Chat AI");
        setHasChatAIPackage(hasChatAI);
      })
      .catch(() => setHasChatAIPackage(false));
  }, [isLoggedIn]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      const res = await apiClient.post("/api/Chat", { message: input });
      const aiReply = { sender: "ai", text: res.reply || "Không nhận được phản hồi." };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("ChatAI Error:", err);
      setMessages(prev => [...prev, { sender: "ai", text: "Xin lỗi, có lỗi xảy ra." }]);
    }
  };

  if (!isLoggedIn || !hasChatAIPackage) return null;

  return (
    <div>
      <div className="chat-icon" onClick={() => setShow(!show)}>Tư vấn AI</div>
      {show && (
        <div className="chat-window">
          <div className="chat-header">Thắc mắc gì hãy hỏi tôi</div>
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Bạn muốn hỏi tôi điều gì nàoo?"
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAI;
