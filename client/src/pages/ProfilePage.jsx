import React, { useState } from "react";
import { Globe, MapPin } from "lucide-react";

const ProfileSetup = () => {
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=12"); // default avatar

  // ✅ Generate Random Avatar
  const generateAvatar = () => {
    const randomNum = Math.floor(Math.random() * 70) + 1;
    setAvatar(`https://i.pravatar.cc/150?img=${randomNum}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-primary text-white px-4 md:mt-16">
      <div className="w-full max-w-2xl bg-[#111] p-10 rounded-xl shadow-lg">

        {/* ✅ Title */}
        <h2 className="text-center text-3xl font-bold mb-6">Complete Your Profile</h2>

        {/* ✅ Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-[3px] border-green-400"
          />
          <button
            onClick={generateAvatar}
            className="mt-4 bg-green-500 hover:bg-green-600 text-black font-medium px-4 py-2 rounded-full flex items-center gap-2 transition"
          >
            🎲 Generate Random Avatar
          </button>
        </div>

        {/* ✅ Full Name */}
        <div className="mb-4">
          <label className="text-sm">Full Name</label>
          <input
            type="text"
            defaultValue="Beth Doe"
            className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none"
          />
        </div>

        {/* ✅ Bio */}
        <div className="mb-4">
          <label className="text-sm">Bio</label>
          <textarea
            rows="3"
            placeholder="Tell others about yourself and your language learning goals"
            className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none"
          ></textarea>
        </div>

        {/* ✅ Native & Learning Language */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="text-sm">Native Language</label>
            <select className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none">
              <option className="bg-black">Select your native language</option>
              <option className="bg-black">English</option>
              <option className="bg-black">Hindi</option>
              <option className="bg-black">Spanish</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="text-sm">Learning Language</label>
            <select className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none">
              <option className="bg-black">Select language you're learning</option>
              <option className="bg-black">French</option>
              <option className="bg-black">German</option>
              <option className="bg-black">Japanese</option>
            </select>
          </div>
        </div>

        {/* ✅ Location */}
        <div className="mb-6">
          <label className="text-sm">Location</label>
          <div className="flex items-center border border-gray-700 rounded-lg mt-1">
            <span className="px-3">
              <MapPin size={18} className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="City, Country"
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* ✅ Submit Button */}
        <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-full flex justify-center items-center gap-2 transition">
          <Globe size={18} /> Complete Onboarding
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
