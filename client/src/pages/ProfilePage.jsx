import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { User, Globe, MapPin, Languages } from "lucide-react";

const ProfilePage = () => {
  const { userData, getUserData, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch user data if not already available
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);
  }
}, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-[#0e0e0e]">
        <p className="text-lg text-gray-300 mb-3">You’re not logged in.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black rounded-full transition font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-400 bg-[#0e0e0e]">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0e0e0e] text-white p-6 mt-16">
      <div className="bg-[#111] w-full max-w-2xl rounded-2xl shadow-lg border border-gray-800 p-8">

        {/* ✅ Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={userData.profilePic || "https://i.pravatar.cc/150?img=1"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-[3px] border-green-400 mb-3"
          />
          <h2 className="text-2xl font-bold text-green-400">{userData.fullName}</h2>
          <p className="text-sm text-gray-400">{userData.email}</p>
        </div>

        {/* ✅ Bio Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 italic">
            {userData.bio || "No bio added yet..."}
          </p>
        </div>

        {/* ✅ Language Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center border border-gray-800 rounded-lg p-4 bg-[#141414]">
            <Languages className="text-green-400 mb-2" size={20} />
            <h4 className="text-sm text-gray-400">Native Language</h4>
            <p className="font-semibold text-lg">
              {userData.nativeLanguage || "Not set"}
            </p>
          </div>

          <div className="flex flex-col items-center border border-gray-800 rounded-lg p-4 bg-[#141414]">
            <Globe className="text-green-400 mb-2" size={20} />
            <h4 className="text-sm text-gray-400">Learning Language</h4>
            <p className="font-semibold text-lg">
              {userData.learningLanguage || "Not set"}
            </p>
          </div>
        </div>

        {/* ✅ Location */}
        <div className="flex flex-col items-center mt-8">
          <MapPin className="text-green-400 mb-2" size={20} />
          <p className="text-gray-300">{userData.location || "Location not added"}</p>
        </div>

        {/* ✅ Action Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => navigate("/update-profile")}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-full transition"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
