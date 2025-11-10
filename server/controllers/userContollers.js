import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// ✅ Middleware to verify JWT
export const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Update Profile Controller
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { fullName, bio, nativeLanguage, learningLanguage, location, profilePic },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/** ✅ Get Recommended Users Based on Language Match */
export const getLanguageMatches = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const users = await UserModel.find({
      _id: { $ne: user._id, $nin: user.friends }, // exclude self and friends
      nativeLanguage: user.learningLanguage, // their native = my learning
      learningLanguage: user.nativeLanguage, // their learning = my native
    }).select("fullName email profilePic nativeLanguage learningLanguage bio location");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
