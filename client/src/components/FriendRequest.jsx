import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FriendRequestButton = ({ userId }) => {
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  const sendRequest = async () => {
    try {
      setStatus("sending");

      const res = await axios.post(
        `${backendUrl}/api/friends/send/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Request sent!");
        setStatus("sent");
      } else {
        toast.warn(res.data.message || "Unable to send request");
        setStatus("idle");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending friend request");
      setStatus("idle");
    }
  };

  // Button UI based on status
  if (status === "sent") {
    return (
      <button
        disabled
        className="w-full bg-green-600 text-black font-semibold py-2 rounded-full opacity-80 cursor-not-allowed"
      >
        ✅ Requested
      </button>
    );
  }

  if (status === "sending") {
    return (
      <button
        disabled
        className="w-full bg-gray-700 text-white font-semibold py-2 rounded-full animate-pulse"
      >
        Sending...
      </button>
    );
  }

  return (
    <button
      onClick={sendRequest}
      className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-full transition"
    >
      Add Friend
    </button>
  );
};

export default FriendRequestButton;
