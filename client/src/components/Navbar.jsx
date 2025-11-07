import React from "react";
import { Bell, LogOut, Palette } from "lucide-react";
import profilePic from "../assets/profile.png"; // replace with your own image
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 w-full bg-[#140e0e] text-white border-b border-gray-800 flex items-center justify-between px-6 py-4 z-50">
      {/* Left: Logo */}
      <h1 className="text-2xl font-extrabold text-green-400 tracking-wide"  onClick={() => navigate('/')}>
      LangMate
      </h1>

      {/* Right: Icons */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative hover:scale-110 transition"
          onClick={() => navigate("/notifications")}>
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
        </button>

        {/* Theme Palette */}
        {/* <button className="relative hover:scale-110 transition">
          <Palette size={20} />
        </button> */}

        {/* Profile Picture */}
        <img
          src={profilePic}
          alt="Profile"
          onClick={() => navigate("/profile")}
          className="w-8 h-8 rounded-full object-cover border border-gray-700 hover:scale-105 transition"
        />

        {/* Logout Icon */}
        <button className="relative hover:scale-110 transition"
         onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
              window.location.reload();
            }}>
          <LogOut size={20} />
          
        </button>
      </div>
    </header>
  );
};

export default Navbar;
