import React, { useState, useContext } from "react";
import signup from "../assets/signup.png";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { backendUrl, loginUser } = useContext(AppContext);
  const navigate = useNavigate();

  // ✅ Manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await loginUser({ email, password });

    if (res.success === false) {
      toast.error(res.message || "Invalid email or password");
    } else {
      toast.success("Welcome back! 👋");
      navigate("/profile"); // Redirect after login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white p-4">
      <div className="flex w-full max-w-5xl bg-[#111] rounded-xl shadow-lg overflow-hidden border border-[#19271a]">
        {/* ✅ Left Form Section */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-green-400">LangMate</h1>
          <h3 className="text-gray-200 mt-1">Welcome back!</h3>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to your account and continue your language journey
          </p>

          {/* ✅ Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder="hello@nitj.ac.in"
                value={email}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition mt-4"
            >
              Sign In
            </button>
          </form>

          {/* ✅ Google Login */}
          <a
            href={`${backendUrl}/api/auth/google`}
            className="mt-4 flex items-center justify-center border border-gray-700 rounded-lg p-2 hover:bg-gray-800 transition"
          >
            <button>Login with Google</button>
          </a>

          {/* ✅ Go to Signup */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-green-400 cursor-pointer"
            >
              Create One
            </span>
          </p>
        </div>

        {/* ✅ Right Image Section */}
        <div className="hidden md:flex w-1/2 bg-[#19271a] items-center justify-center p-6">
          <div className="text-center">
            <img
              src={signup}
              alt="Illustration"
              className="w-150 h-120 object-contain mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4">
              Connect with language partners worldwide
            </h2>
            <p className="text-sm text-gray-300 mt-2">
              Practice conversations, make friends, and improve your language
              skills together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
