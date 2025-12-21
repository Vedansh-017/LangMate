import { Router } from "express";
import passport from "passport";
import { registerUser, loginUser, googleLoginSuccess} from "../controllers/authControllers.js";

const authRoutes = Router();

// ✨ Normal Signup & Login
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);

// ✨ Google OAuth Login
authRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after login
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {session:false, failureRedirect: "http://localhost:5173/login" }),
  googleLoginSuccess
);


export default authRoutes;
