import { Router } from "express";
import passport from "passport";
import { registerUser, loginUser, googleLoginSuccess } from "../controllers/authControllers.js";

const userRouter = Router();

// ✨ Normal Signup & Login
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// ✨ Google OAuth Login
userRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after login
userRouter.get("/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/profile",   // frontend success page
     failureRedirect: "http://localhost:5173/login?error=invalid_domain"       // frontend login page
  })
);



export default userRouter;
