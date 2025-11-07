import React, { useState } from "react";
import { Home, Users, Bell, Menu, X } from "lucide-react";
import profilePic from "../assets/profile.png"; // replace with your own image
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* --- Mobile Header (for small screens) --- */}
      <div className="md:hidden flex items-center justify-between bg-[#140e0e] text-green-400 px-4 py-3 border-b border-gray-800 mt-16">
        <h1 className="text-xl font-bold">Menu</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Sidebar --- */}
      <aside
        className={`fixed md:fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-[#0f0f0f] border-r border-gray-800 text-white flex flex-col justify-between transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* --- Nav Links --- */}
        <div className="mt-6 px-4 space-y-2 overflow-y-auto">
          <button
               onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition w-full"
          >
            <Home size={20} /> Home
          </button>
          <button
                onClick={() => navigate('/friends')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition w-full"
          >
            <Users size={20} /> Friends
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition w-full"
          >
            <Bell size={20} /> Notifications
          </button>
        </div>

        {/* --- Bottom User Info --- */}
        <div className="px-4 py-4 border-t border-gray-800 bg-[#141414] flex items-center gap-3">
          <img
            src={profilePic}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">Kyle Doe</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
            </p>
          </div>
        </div>
      </aside>

      {/* --- Mobile overlay --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
