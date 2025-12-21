import { useEffect } from "react";
import { socket } from "../socket";
import { toast } from "react-toastify";

const useSocket = (userId) => {
  useEffect(() => {
    if (!userId) return;

    // connect socket
    socket.connect();

    // register user
    socket.emit("register", userId);

    // friend request notification
    socket.on("friendRequestReceived", (data) => {
      toast.info(`${data.senderName} sent you a friend request!`);
    });

    // optional: message notification
    socket.on("receive_message", (msg) => {
      if (msg.sender !== userId) {
        toast.info("📩 New message received");
      }
    });

    return () => {
      socket.off("friendRequestReceived");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [userId]);
};

export default useSocket;
