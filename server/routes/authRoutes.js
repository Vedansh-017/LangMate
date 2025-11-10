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
authRoutes.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/profile",   // frontend success page
     failureRedirect: "http://localhost:5173/login?error=invalid_domain"       // frontend login page
  })
);


export default authRoutes;
