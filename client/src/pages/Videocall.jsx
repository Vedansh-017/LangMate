import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

/*
PROPS:
friendId -> person you call
myId     -> logged in user id (REQUIRED for register)
onClose  -> close modal
*/

const VideoCall = ({ friendId, myId, onClose }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [calling, setCalling] = useState(false);
  const [inCall, setInCall] = useState(false);

  // ===============================
  // Always attach stream safely
  // ===============================
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // ===============================
  // Create Peer
  // ===============================
  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice_candidate", {
          to: friendId,
          candidate: e.candidate,
        });
      }
    };

    peer.onconnectionstatechange = () => {
      console.log("Connection:", peer.connectionState);
    };

    peerRef.current = peer;
  };

  // ===============================
  // SOCKET SETUP
  // ===============================
  useEffect(() => {
    socket.connect();

    // 🔥 REQUIRED for your backend onlineUsers map
    socket.emit("register", myId);

    // incoming call
    socket.on("incoming_call", ({ from, offer }) => {
      setIncoming({ from, offer });
    });

    // accepted
    socket.on("call_accepted", async ({ answer }) => {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      setCalling(false);
      setInCall(true);
    });

    // ice
    socket.on("ice_candidate", async ({ candidate }) => {
      try {
        await peerRef.current?.addIceCandidate(candidate);
      } catch {}
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("ice_candidate");
    };
  }, [myId]);

  // ===============================
  // Start Call (Caller)
  // ===============================
  const startCall = async () => {
    setCalling(true);
    setInCall(true); // 🔥 ensures video exists

    createPeer();

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(mediaStream);

    mediaStream.getTracks().forEach((track) =>
      peerRef.current.addTrack(track, mediaStream)
    );

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket.emit("call_user", {
      to: friendId,
      offer,
    });
  };

  // ===============================
  // Accept Call (Receiver)
  // ===============================
  const acceptCall = async () => {
    const callData = incoming;
    setIncoming(null);
    setInCall(true);

    createPeer();

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(mediaStream);

    mediaStream.getTracks().forEach((track) =>
      peerRef.current.addTrack(track, mediaStream)
    );

    await peerRef.current.setRemoteDescription(
      new RTCSessionDescription(callData.offer)
    );

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socket.emit("answer_call", {
      to: callData.from,
      answer,
    });
  };

  // ===============================
  // End Call
  // ===============================
  const endCall = () => {
    stream?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();

    setCalling(false);
    setInCall(false);
    setStream(null);

    onClose?.();
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">

      {/* Incoming popup */}
      {incoming && (
        <div className="bg-white p-6 rounded text-center">
          <p className="mb-4 font-semibold">Incoming Call...</p>

          <button
            onClick={acceptCall}
            className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
          >
            Accept
          </button>

          <button
            onClick={() => setIncoming(null)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Decline
          </button>
        </div>
      )}

      {/* Active Call UI */}
      {inCall && (
        <div className="relative bg-white p-4 rounded-lg flex flex-col gap-4">

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-96 h-64 bg-black rounded"
          />

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-40 h-28 absolute bottom-4 right-4 border rounded"
          />

          <button
            onClick={endCall}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            End Call
          </button>
        </div>
      )}

      {/* Start button */}
      {!inCall && !incoming && (
        <button
          onClick={startCall}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Call
        </button>
      )}
    </div>
  );
};

export default VideoCall;
