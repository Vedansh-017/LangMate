import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";
import http from "http";

import connectDB from "./config/mongodb.js";
import "./config/passport.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { initSocket } from "./socket/socket.js"; // ⭐ IMPORT

const PORT = process.env.PORT || 4000;

await connectDB();

const app = express();
const server = http.createServer(app);

// ⭐ INIT SOCKET HERE
const io = initSocket(server);

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

// ================= START =================
server.listen(PORT, () =>
  console.log("🚀 Server running on port " + PORT)
);
