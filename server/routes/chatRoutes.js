import express from "express";
import { authMiddleware} from "../middleware/authMiddleware.js";
import Message from "../models/message.js";

const router = express.Router();

router.get("/:friendId", authMiddleware, async (req, res) => {
  const myId = req.user.id;
  const friendId = req.params.friendId;

  const roomId = [myId, friendId].sort().join("_");

  const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
  res.json(messages);
});

export default router;
