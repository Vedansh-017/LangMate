import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js"

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
