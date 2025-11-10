import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
     required: function () {
      return !this.googleId; // Only required if not Google login
    },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function () {
      return !this.googleId; // Password not required if user logs in with Google
    },
      minlength: 6,
    },
googleId: {
  type: String,
  default: null,
},

      profilePic: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    nativeLanguage: {
      type: String,
      default: "",
    },

    learningLanguage: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "", // Example: "New Delhi, India"
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    ],

  },
  { timestamps: true } // ✅ createdAt & updatedAt automatically
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
