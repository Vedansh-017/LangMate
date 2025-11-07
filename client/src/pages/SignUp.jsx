import React, { useState, useContext } from "react";
import signup from "../assets/signup.png";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { backendUrl, registerUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // ✅ Fix: Correct handleChange
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password } = formData;

    // ✅ Simple validation
    if (!fullName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    // ✅ Send request
    const res = await registerUser({ fullName, email, password });

    if (res.success === false) {
      toast.error(res.message || "Registration failed");
    } else {
      toast.success("Account created successfully!");
      navigate("/login"); // Redirect to login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white p-4">
      <div className="flex w-full max-w-5xl bg-[#111] rounded-xl shadow-lg overflow-hidden border border-[#19271a]">
        {/* ✅ Left Form Section */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-green-400">LangMate</h1>
          <p className="text-gray-400 mt-1">Create an Account</p>
          <p className="text-sm text-gray-500 mb-6">
            Join LangConnect and start your language learning journey
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* ✅ Full Name */}
            <div>
              <label className="text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400"
              />
            </div>

            {/* ✅ Email */}
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400"
              />
            </div>

            {/* ✅ Password */}
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* ✅ Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition"
            >
              Create Account
            </button>
          </form>

          {/* ✅ Google Login */}
          <a
            href={`${backendUrl}/api/auth/google`}
            className="mt-4 flex items-center justify-center border border-gray-700 rounded-lg p-2 hover:bg-gray-800 transition"
          >
            <button>Login with Google</button>
          </a>

          {/* ✅ Redirect to Login */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              className="text-green-400 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>

        {/* ✅ Right Image Section */}
        <div className="hidden md:flex w-1/2 bg-[#19271a] items-center justify-center p-6">
          <div className="text-center">
            <img
              src={signup}
              alt="Illustration"
              className="mx-auto w-150 object-contain"
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

export default SignupPage;
