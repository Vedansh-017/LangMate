import UserModel from "../models/userModel.js";
import FriendRequest from "../models/FriendRequest.js";
import { getSocketId } from "../utils/socketStore.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ success: false, message: "You can't send a request to yourself." });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: "User not found" });

    // Prevent duplicates
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    if (existingRequest)
      return res.status(400).json({ success: false, message: "Request already sent" });

    // Create request
    const request = await FriendRequest.create({ sender: senderId, receiver: receiverId });

    // ✅ Emit real-time event to receiver
    const io = req.app.get("io");
    const receiverSocket = getSocketId(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("friendRequestReceived", {
        senderId,
        senderName: sender.fullName,
        message: "You received a new friend request!",
      });
    }

    res.status(200).json({ success: true, message: "Friend request sent!" });
  } catch (error) {
    console.error("❌ Error in sendFriendRequest:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/** ✅ Respond to Request (accept/reject) */
export const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      await UserModel.findByIdAndUpdate(request.sender, { $push: { friends: request.receiver } });
      await UserModel.findByIdAndUpdate(request.receiver, { $push: { friends: request.sender } });
    }

    res.json({ success: true, message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** ✅ Get all pending friend requests (received) */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate("sender", "fullName email profilePic");

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** ✅ Get all friends */
export const getFriends = async (req, res) => {
  try {
    console.log("✅ FRIENDS CONTROLLER CALLED");
    console.log("User from token:", req.user);

    const user = await UserModel.findById(req.user._id)
      .populate("friends", "fullName email profilePic bio nativeLanguage learningLanguage");

    if (!user) {
      console.log("❌ No user found for ID:", req.user._id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ Friends found:", user.friends.length);

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    console.error("🔥 Error in getFriends:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

