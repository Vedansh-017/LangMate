import React from "react";
import { User, Bell, UserPlus, Check } from "lucide-react";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import Sidebar from "../components/Sidebar";

const Notifications = () => {
  const friendRequests = [
    {
      name: "Burak Örkmez",
      native: "Spanish",
      learning: "English",
    },
  ];

  const newConnections = [
    {
      name: "Kyle Doe",
      message: "Kyle Doe accepted your friend request",
      time: "Recently",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row bg-primary text-white min-h-screen p-3 md:p-0"
    >
      <Sidebar className="md:w-1/5 w-full md:fixed md:h-screen" />

      <main className="flex-1 p-4 sm:p-10 md:p-10 md:mt-16 md:ml-[20%] overflow-y-auto w-full">
        {/* Title Animation */}
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-semibold mb-8"
        >
          Notifications
        </motion.h2>

        {/* Friend Requests Section */}
        <section className="mb-10">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <UserPlus className="text-green-400 w-5 h-5" />
            <h3 className="text-xl font-semibold">Friend Requests</h3>
            <span className="ml-2 text-xs bg-green-500 text-black px-2 py-1 rounded-full">
              {friendRequests.length}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#140e0e] border border-gray-800 rounded-xl p-5 space-y-4"
          >
            {friendRequests.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex justify-between items-center p-4 rounded-lg"
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 text-sm rounded-full transition"
                >
                  Accept
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* New Connections Section */}
        <section>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <Bell className="text-green-400 w-5 h-5" />
            <h3 className="text-xl font-semibold">New Connections</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#140e0e] border border-gray-800 rounded-xl p-5 space-y-4"
          >
            {newConnections.map((conn, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex justify-between items-center p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10 text-green-400" />
                  <div>
                    <h4 className="font-semibold">{conn.name}</h4>
                    <p className="text-sm text-gray-400">{conn.message}</p>
                    <p className="text-xs text-gray-500 mt-1">⏱ {conn.time}</p>
                  </div>
                </div>
                <button className="bg-gray-900 text-green-400 border border-green-500 px-3 py-1 text-xs rounded-full flex items-center gap-1">
                  <Check size={14} /> New Friend
                </button>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default Notifications;
