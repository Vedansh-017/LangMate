import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { User, MapPin } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import FriendRequestButton from "../components/FriendRequest.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  const [friends, setFriends] = useState([]);
  const [matches, setMatches] = useState([]);

  // ✅ Fetch friends and language matches
  useEffect(() => {
    if (token) {
      fetchFriends();
      fetchMatches();
    }
  }, [userData]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/friends/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data.friends || []);
    } catch {
      toast.error("Failed to load friends");
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/match`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(res.data.users || []);
    } catch {
      toast.error("Failed to load suggested learners");
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row bg-[#0e0e0e] text-white min-h-screen p-3 md:p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sidebar */}
      <Sidebar className="md:w-1/5 w-full md:fixed md:h-screen" />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-10 md:p-10 md:mt-16 md:ml-[20%] overflow-y-auto w-full">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8 flex-wrap"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-0">
            Your Friends
          </h2>
          <button
            onClick={() => navigate("/friends")}
            className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            Friend Requests
          </button>
        </motion.div>

        {/* ✅ Friends Section */}
        {friends.length === 0 ? (
          <p className="text-gray-400 mb-12">No friends yet. Start connecting!</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {friends.map((friend, i) => (
              <motion.div
                key={i}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold">{friend.fullName}</h3>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-1 text-black rounded-full bg-green-500">
                        🏳️‍🌈 Native: {friend.nativeLanguage || "N/A"}
                      </span>
                      <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                        📘 Learning: {friend.learningLanguage || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 w-full bg-gray-900 hover:bg-green-600 transition text-sm py-2 rounded-full"
                  onClick={() => navigate(`/chat/${friend._id}`, {
  state: { friendName: friend.fullName },
})}
                >
                  Message
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* 🌍 Meet New Learners */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Meet New Learners</h2>
          <p className="text-gray-400 mb-6">
            Discover perfect language exchange partners based on your profile.
          </p>

          {matches.length === 0 ? (
            <p className="text-gray-500">No matching learners found yet.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
            >
              {matches.map((user, i) => (
                <motion.div
                  key={i}
                  className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800"
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-10 h-10 text-green-400" />
                    <div>
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <div className="flex items-center text-sm text-gray-400 gap-1">
                        <MapPin className="w-4 h-4" />
                        {user.location || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                      🏳️‍🌈 Native: {user.nativeLanguage}
                    </span>
                    <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                      📘 Learning: {user.learningLanguage}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 h-10">{user.bio || "No bio available"}</p>

                  <FriendRequestButton userId={user._id} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default Home;
