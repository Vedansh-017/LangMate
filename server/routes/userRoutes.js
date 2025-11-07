import express from "express";
import { verifyUser, updateProfile , getUserProfile} from "../controllers/userContollers.js";
const router = express.Router();

// ✅ GET /api/user/profile — fetch current user info
router.get("/profile", verifyUser, getUserProfile);

// ✅ PUT /api/user/update-profile — update user details
router.put("/update-profile", verifyUser, updateProfile);

export default router;
