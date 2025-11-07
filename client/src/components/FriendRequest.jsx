import React, { useState } from "react";

const FriendRequestButton = () => {
  const [isSent, setIsSent] = useState(false);

  const handleClick = () => {
    setIsSent(true); // Change text and disable button after click
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSent}
      className={`px-4 py-2 rounded-lg text-sm transition 
        ${isSent ? "w-full bg-gray-600 cursor-not-allowedw-full text-black font-medium py-2 rounded-full flex items-center justify-center gap-2 transition" : "w-full bg-green-600 hover:bg-green-500 text-black font-medium py-2 rounded-full flex items-center justify-center gap-2 transition"}`}
    >
      {isSent ? "Request Sent" : "Friend Requests"}
    </button>
  );
};

export default FriendRequestButton;
