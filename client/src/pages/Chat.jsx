import React, { useEffect, useRef, useState } from "react";
import { Video, Send } from "lucide-react";
import { motion } from "framer-motion";
import { socket } from "../socket"; // socket.io client

const ChatUI = ({ friendId, friendName }) => {
  const myId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;

  const roomId = [myId, friendId].sort().join("_");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);
  let typingTimeout = useRef(null);

  /* 🔽 Auto scroll */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* 🔽 Load chat history */
  useEffect(() => {
    fetch(`http://localhost:4000/api/chat/${friendId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setMessages);
  }, [friendId]);

  /* 🔽 Socket lifecycle */
  useEffect(() => {
    socket.connect();

    socket.emit("register", myId);
    socket.emit("join_chat", { myId, friendId });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stop_typing", () => setTyping(false));

    socket.on("messages_seen", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.sender !== myId ? { ...m, status: "seen" } : m
        )
      );
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [friendId]);

  /* 🔽 Auto scroll on message */
  useEffect(scrollToBottom, [messages]);

  /* 🔽 Send message */
  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      senderId: myId,
      receiverId: friendId,
      text: message,
    });

    setMessage("");
  };

  /* 🔽 Typing handler */
  const handleTyping = () => {
    socket.emit("typing", { roomId, senderId: myId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId });
    }, 800);
  };

  return (
    <motion.div
      className="flex bg-[#c9e8c7] text-black min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <main className="flex-1 p-4 md:mt-16 flex justify-center">
        <div className="bg-white rounded-2xl h-[75vh] w-full max-w-[1200px] flex flex-col shadow-lg">

          {/* 🔹 HEADER */}
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{friendName}</h2>
              <p className="text-xs text-gray-500">
                {typing ? "Typing..." : "Online"}
              </p>
            </div>
            <button
              onClick={() => socket.emit("start_call", { roomId })}
              className="bg-green-500 px-3 py-2 rounded-full text-white hover:bg-green-600"
            >
              <Video size={16} />
            </button>
          </div>

          {/* 🔹 MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender === myId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    msg.sender === myId
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex justify-end gap-1 text-[10px] text-gray-500">
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.sender === myId && (
                      <span>
                        {msg.status === "seen"
                          ? "✓✓"
                          : msg.status === "delivered"
                          ? "✓"
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 🔹 INPUT */}
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
  );
};

export default ChatUI;
