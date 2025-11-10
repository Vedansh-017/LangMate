import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const useSocket = (userId) => {
  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);

      socket.on("friendRequestReceived", (data) => {
        toast.info(`${data.senderName} sent you a friend request!`);
      });
    }

    return () => {
      socket.off("friendRequestReceived");
    };
  }, [userId]);
};

export default useSocket;
