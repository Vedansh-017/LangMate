import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import passport from "passport";
import bodyParser from "body-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import session from "express-session";
import "./config/passport.js";
import userRouter from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { onlineUsers } from "./utils/socketStore.js";
import Message from "./models/message.js";
import chatRoutes from "./routes/chatRoutes.js";

const PORT = process.env.PORT || 4000;
await connectDB();

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
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
    console.log("Registered user:", userId);
  });

  // Join private room
  socket.on("join_chat", ({ myId, friendId }) => {
    const roomId = [myId, friendId].sort().join("_");
    socket.join(roomId);
    console.log(`User ${myId} joined room ${roomId}`);
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

  // Typing indicator
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
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("incoming_call", {
        from: socket.userId,
        offer,
      });
    }
  });

  socket.on("answer_call", ({ to, answer }) => {
    const targetSocket = onlineUsers.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit("call_accepted", {
        from: socket.userId,
        answer,
      });
    }
  });

socket.on("ice_candidate", ({ to, candidate }) => {
  const targetSocket = onlineUsers.get(to);
  if (targetSocket) {
    io.to(targetSocket).emit("ice_candidate", { candidate }); // wrap it
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

// Make io available to controllers
app.set("io", io);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ================= ROUTES =================
app.get("/", (req, res) => res.send("Server Live ✅"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes);

// ================= START SERVER =================
server.listen(PORT, () =>
  console.log("🚀 Server + Socket.IO running on port " + PORT)
);
