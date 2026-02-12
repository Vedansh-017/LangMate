import { Server } from "socket.io";
import { onlineUsers } from "../utils/socketStore.js";
import Message from "../models/message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      socket.broadcast.emit("user_online", userId);
    });

    // Join private room
    socket.on("join_chat", ({ myId, friendId }) => {
      const roomId = [myId, friendId].sort().join("_");
      socket.join(roomId);
    });

    // Send message
    socket.on("send_message", async ({ senderId, receiverId, text }) => {
      const roomId = [senderId, receiverId].sort().join("_");

      const message = await Message.create({
        roomId,
        sender: senderId,
        receiver: receiverId,
        text,
      });

      io.to(roomId).emit("receive_message", message);
    });

    // Typing
    socket.on("typing", ({ roomId }) => {
      socket.to(roomId).emit("typing");
    });

    socket.on("stop_typing", ({ roomId }) => {
      socket.to(roomId).emit("stop_typing");
    });

    // Online check
    socket.on("check_online", (friendId) => {
      socket.emit("online_status", onlineUsers.has(friendId));
    });

    // ============ VIDEO CALL SIGNALING ============

    socket.on("call_user", ({ to, offer }) => {
      const target = onlineUsers.get(to);
      if (target) {
        io.to(target).emit("incoming_call", {
          from: socket.userId,
          offer,
        });
      }
    });

    socket.on("answer_call", ({ to, answer }) => {
      const target = onlineUsers.get(to);
      if (target) {
        io.to(target).emit("call_accepted", {
          from: socket.userId,
          answer,
        });
      }
    });

    socket.on("ice_candidate", ({ to, candidate }) => {
      const target = onlineUsers.get(to);
      if (target) {
        io.to(target).emit("ice_candidate", { candidate });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit("user_offline", socket.userId);
      }
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};
     