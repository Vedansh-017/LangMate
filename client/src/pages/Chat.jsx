import React, { useState } from "react";
import { Video, Send } from "lucide-react";
import { motion } from "framer-motion";

const ChatUI = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Doing fine!", time: "7:33 AM" },
    { id: 2, sender: "other", text: "wbu? 👀", time: "7:33 AM" },
    { id: 3, sender: "me", text: "sup!", time: "6:21 AM" },
    { id: 4, sender: "me", text: "Thanks!", time: "7:35 AM" },
    {
      id: 5,
      sender: "other",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png",
      text: "Look at this",
      time: "7:36 AM",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "me", text: message, time: "Now" },
    ]);
    setMessage("");
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row bg-[#c9e8c7] text-black min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ✅ Main content */}
      <main className="flex-1 p-4 sm:p-10 md:mt-16 flex justify-center">
        <div className="bg-white rounded-2xl h-[75vh] w-full max-w-[1200px] flex flex-col overflow-hidden relative shadow-lg">

          {/* ✅ Header (Fixed) */}
          <div className="w-full border-b border-gray-300 flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10">
            <div>
              <h2 className="font-semibold">Test Acc</h2>
              <p className="text-xs text-gray-500">2 members, 2 online</p>
            </div>
            <button className="bg-green-500 px-3 py-2 rounded-full text-white hover:bg-green-600 transition">
              <Video size={16} />
            </button>
          </div>

          {/* ✅ Scrollable Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "other" && (
                  <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full mr-2" alt="avatar" />
                )}

                <div className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  msg.sender === "me" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
                }`}>
                  {msg.image && (
                    <img src={msg.image} className="rounded-lg w-48 mb-2" alt="media" />
                  )}
                  <p>{msg.text}</p>
                  <span className="text-[10px] text-gray-500">{msg.time}</span>
                </div>

                {msg.sender === "me" && (
                  <img src="https://i.pravatar.cc/40?u=me" className="w-8 h-8 rounded-full ml-2" alt="avatar" />
                )}
              </div>
            ))}
          </div>

          {/* ✅ Footer (Fixed Input Bar) */}
          <div className="border-t border-gray-300 px-4 py-2 flex items-center gap-2 bg-white sticky bottom-0">
            <button>😊</button>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none"
            />
            <button onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default ChatUI;
