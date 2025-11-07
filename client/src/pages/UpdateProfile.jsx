import React, { useState, useEffect, useContext } from "react";
import { Globe, MapPin } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { userData, updateProfile, getUserData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "https://i.pravatar.cc/150?img=12",
  });
  const navigate = useNavigate();

  // ✅ Available languages
  const languages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Mandarin",
    "Korean",
    "Italian",
    "Russian",
    "Arabic",
    "Portuguese",
    "Turkish",
  ];

  // ✅ Load existing user data
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        bio: userData.bio || "",
        nativeLanguage: userData.nativeLanguage || "",
        learningLanguage: userData.learningLanguage || "",
        location: userData.location || "",
        profilePic: userData.profilePic || "https://i.pravatar.cc/150?img=12",
      });
    } else {
      getUserData(); // Fetch user if not already loaded
    }
  }, [userData]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Generate random avatar
  const generateAvatar = () => {
    const randomNum = Math.floor(Math.random() * 70) + 1;
    setFormData({
      ...formData,
      profilePic: `https://i.pravatar.cc/150?img=${randomNum}`,
    });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res?.success) {
      toast.success("Profile updated successfully!");
      navigate("/profile"); // redirect to profile or dashboard
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0e0e0e] text-white px-4 mt-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#111] p-10 rounded-xl shadow-lg"
      >
        <h2 className="text-center text-3xl font-bold mb-6">
          Update Your Profile
        </h2>

        {/* ✅ Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.profilePic}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-[3px] border-green-400"
          />
          <button
            type="button"
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
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none"
          />
        </div>

        {/* ✅ Bio */}
        <div className="mb-4">
          <label className="text-sm">Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell others about yourself and your learning goals"
            className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none"
          ></textarea>
        </div>

        {/* ✅ Native & Learning Language */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <label className="text-sm">Native Language</label>
            <select
              name="nativeLanguage"
              value={formData.nativeLanguage}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none"
            >
              <option className="bg-black">Select your native language</option>
              {languages.map((lang, index) => (
                <option key={index} className="bg-black">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label className="text-sm">Learning Language</label>
            <select
              name="learningLanguage"
              value={formData.learningLanguage}
              onChange={handleChange}
              className="w-full p-3 mt-1 bg-transparent border border-gray-700 rounded-lg focus:border-green-400 outline-none"
            >
              <option className="bg-black">Select language you're learning</option>
              {languages.map((lang, index) => (
                <option key={index} className="bg-black">
                  {lang}
                </option>
              ))}
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
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-full flex justify-center items-center gap-2 transition"
        >
          <Globe size={18} /> Save Changes
        </button>
      </form>
    </div>
  );
};
export default UpdateProfile;