import React from "react";
import { motion } from "framer-motion";
import { User, MapPin, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import FriendRequestButton from "../components/FriendRequest.jsx";


const Home = () => {
  const navigate = useNavigate();

  const friends = [
    { name: "Arpit", native: "Spanish", learning: "English" },
    { name: "Kushu", native: "Portuguese", learning: "Spanish" },
  ];

  const learners = [
    {
      name: "John Doe",
      location: "Istanbul, Turkey",
      native: "Mandarin",
      learning: "Spanish",
      bio: "dsadasdasa",
    },
    {
      name: "Test Acc",
      location: "Istanbul, Turkey",
      native: "Spanish",
      learning: "Japanese",
      bio: "sdasdasdad",
    },
    {
      name: "Sofia Garcia",
      location: "Madrid",
      native: "Spanish",
      learning: "German",
      bio: "Language teacher looking to improve my German skills.",
    },
    {
      name: "Kenji Tanaka",
      location: "Tokyo",
      native: "Japanese",
      learning: "English",
      bio: "Tech professional looking for language exchange partners.",
    },
    {
      name: "Elena Petrov",
      location: "Moscow",
      native: "Russian",
      learning: "French",
      bio: "University student studying languages and international relations.",
    },
    {
      name: "Marco Rossi",
      location: "Rome",
      native: "Italian",
      learning: "Mandarin",
      bio: "Food blogger interested in cultural exchange through cuisine.",
    },
  ];

  return (
    <motion.div
      className="flex flex-col md:flex-row bg-primary text-white min-h-screen p-3 md:p-0"
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
          <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
            Friend Requests
          </button>
        </motion.div>

        {/* Friends Section */}
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
                  <h3 className="text-lg font-semibold">{friend.name}</h3>
                  <div className="flex gap-3 mt-1 flex-wrap">
                    <span className="text-xs px-2 py-1 text-black rounded-full bg-green-500">
                      🏳️‍🌈 Native: {friend.native}
                    </span>
                    <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                      📘 Learning: {friend.learning}
                    </span>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full bg-gray-900 hover:bg-green-600 transition text-sm py-2 rounded-full" onClick={() => navigate('/chat')}>
                Message
              </button>
            </motion.div>
          ))}
        </div>

        {/* Meet New Learners */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Meet New Learners</h2>
          <p className="text-gray-400 mb-6">
            Discover perfect language exchange partners based on your profile.
          </p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {learners.map((user, i) => (
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
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <div className="flex items-center text-sm text-gray-400 gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                    🏳️‍🌈 Native: {user.native}
                  </span>
                  <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                    📘 Learning: {user.learning}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-4 h-10">{user.bio}</p>

                <FriendRequestButton />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default Home;
