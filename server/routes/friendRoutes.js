import express from "express";
import { sendFriendRequest, respondToRequest, getPendingRequests, getFriends } from "../controllers/friendController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request/:receiverId", authMiddleware, sendFriendRequest);
router.put("/respond/:requestId", authMiddleware, respondToRequest);
router.get("/pending", authMiddleware, getPendingRequests);
router.get("/", authMiddleware, getFriends);
    
export default router;
