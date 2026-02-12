import React, { useEffect, useRef, useState, useContext } from "react";
import { Video, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useLocation } from "react-router-dom";

import { socket } from "../socket";
import VideoCall from "./VideoCall";
import { AppContext } from "../context/AppContext"; // ⭐ ADDED

const ChatUI = () => {
  /* ================================
      CONTEXT
  ================================= */
  const { backendUrl } = useContext(AppContext); // ⭐ GET URL FROM CONTEXT


  /* ================================
      ROUTER + USER INFO
  ================================= */
  const { friendId } = useParams();
  const location = useLocation();

  const friendName = location.state?.friendName || "Friend";

  const token = localStorage.getItem("token");
  const myId = JSON.parse(atob(token.split(".")[1])).id;

  const roomId = [myId, friendId].sort().join("_");


  /* ================================
      STATE
  ================================= */
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showCall, setShowCall] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);


  /* ================================
      LOAD OLD CHAT HISTORY
  ================================= */
  useEffect(() => {
    fetch(`${backendUrl}/api/chat/${friendId}`, { // ⭐ UPDATED
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMessages);
  }, [friendId, backendUrl]);


  /* ================================
      SOCKET CONNECTION
  ================================= */
  useEffect(() => {
    if (!friendId || !myId) return;

    socket.connect();

    socket.emit("register", myId);
    socket.emit("join_chat", { myId, friendId });
    socket.emit("check_online", friendId);

    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    socket.on("typing", () => setTyping(true));
    socket.on("stop_typing", () => setTyping(false));

    socket.on("online_status", setIsOnline);

    socket.on("user_online", (id) => {
      if (id === friendId) setIsOnline(true);
    });

    socket.on("user_offline", (id) => {
      if (id === friendId) setIsOnline(false);
    });

    return () => socket.off();
  }, [friendId]);


  /* ================================
      AUTO SCROLL
  ================================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  /* ================================
      SEND MESSAGE
  ================================= */
  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      senderId: myId,
      receiverId: friendId,
      text: message,
    });

    setMessage("");
  };


  /* ================================
      TYPING INDICATOR
  ================================= */
  const handleTyping = () => {
    socket.emit("typing", { roomId });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId });
    }, 800);
  };


  /* ================================
      UI (unchanged)
  ================================= */
  return (
    <>
      <motion.div
        className="flex bg-[#c9e8c7] text-black min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <main className="flex-1 p-4 md:mt-16 flex justify-center">
          <div className="bg-white rounded-2xl h-[75vh] w-full max-w-[1200px] flex flex-col shadow-lg">

            <div className="border-b px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{friendName}</h2>
                <p className="text-xs text-gray-500">
                  {typing ? "Typing..." : isOnline ? "Online" : "Offline"}
                </p>
              </div>

              <button
                onClick={() => setShowCall(true)}
                className="bg-green-500 px-3 py-2 rounded-full text-white hover:bg-green-600"
              >
                <Video size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isMine = msg.sender === myId;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                        isMine
                          ? "bg-blue-100 text-right"
                          : "bg-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t px-4 py-2 flex items-center gap-2">
              <input
                type="text"
                value={message}
                placeholder="Type your message..."
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border rounded-full px-4 py-2 outline-none"
              />

              <button onClick={handleSend}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </motion.div>

      {showCall && (
        <VideoCall
          friendId={friendId}
          onClose={() => setShowCall(false)}
        />
      )}
    </>
  );
};

export default ChatUI;
    