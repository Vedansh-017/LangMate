// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
