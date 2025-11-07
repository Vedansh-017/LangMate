import React from "react";
import { motion } from "framer-motion";
import { User, MessageCircle, UserPlus, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Friend = () => {
  const navigate = useNavigate();
  const friends = [
    { name: "Burak Örkmez", native: "Spanish", learning: "English" },
    { name: "Beth Doe", native: "Portuguese", learning: "Spanish" },
  ];

  const friendRequests = [
    { name: "John Doe", native: "Mandarin", learning: "French" },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-primary text-white min-h-screen p-3 md:p-0">
      {/* Sidebar */}
      <Sidebar className="md:w-1/5 w-full md:fixed md:h-screen" />

      {/* Main content with fade animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-4 sm:p-10 md:p-10 md:mt-16 md:mt-0 md:ml-[20%] overflow-y-auto w-full md:mx-auto"
      >
        <h2 className="text-3xl font-semibold mb-8">Friends</h2>

        {/* --- Your Friends Section --- */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-green-400 w-5 h-5" />
            <h3 className="text-xl font-semibold">Your Friends</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 w-250">
            {friends.map((friend, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <User className="w-10 h-10 text-green-400" />
                  <div>
                    <h4 className="text-lg font-semibold">{friend.name}</h4>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="bg-green-600 text-xs px-2 py-1 rounded-full text-black">
                        🏳️‍🌈 Native: {friend.native}
                      </span>
                      <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                        📘 Learning: {friend.learning}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-gray-900 hover:bg-green-600 transition text-sm py-2 rounded-full flex items-center justify-center gap-2" onClick={() => navigate('/chat')}>
                  <MessageCircle size={16} /> Message
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Friend Requests Section --- */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-green-400 w-5 h-5" />
            <h3 className="text-xl font-semibold">Friend Requests</h3>
          </div>

          <div className="space-y-4 w-250">
            {friendRequests.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10 text-green-400" />
                  <div>
                    <h4 className="font-semibold">{req.name}</h4>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="bg-green-600 text-xs px-2 py-1 rounded-full text-black">
                        🏳️‍🌈 Native: {req.native}
                      </span>
                      <span className="bg-gray-800 text-xs px-2 py-1 rounded-full">
                        📘 Learning: {req.learning}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 text-sm rounded-full transition">
                    Accept
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-full transition flex items-center gap-1">
                    <X size={14} /> Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  );
};

export default Friend;
