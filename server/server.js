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
import { onlineUsers } from "./utils/socketStore.js"; // we'll create this
import Message from "./models/message.js"; 
const PORT = process.env.PORT || 4000;
await connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// ✅ Store socket IDs of online users
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 1️⃣ Register user (already exists)
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log("Registered user:", userId);
  });

  // 2️⃣ JOIN CHAT ROOM  ← 🔥 THIS IS STEP 2
  socket.on("join_chat", ({ myId, friendId }) => {
    const roomId = [myId, friendId].sort().join("_");
    socket.join(roomId);
    console.log(`User ${myId} joined room ${roomId}`);
  });

  // 3️⃣ SEND MESSAGE
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

  // 4️⃣ DISCONNECT (already exists)
  socket.on("disconnect", () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Make io accessible to controllers
app.set("io", io);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
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

// Routes
app.get("/", (req, res) => res.send("Server Live ✅"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/friends", friendRoutes);

// ✅ Start server with Socket.io
server.listen(PORT, () => console.log("Server running on port " + PORT));
