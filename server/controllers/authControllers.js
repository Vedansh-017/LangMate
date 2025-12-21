import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Signup Controller
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(405).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userData = await UserModel.findById(user._id).select("-password")
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const googleLoginSuccess = async (req, res) => {
  try {
    const user = req.user; // from passport

    // generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect with token
    res.redirect(
      `http://localhost:5173/profile?token=${token}`
    );
  } catch (err) {
    console.error(err);
    res.redirect("http://localhost:5173/login");
  }
};
