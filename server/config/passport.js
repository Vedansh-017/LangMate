import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/userModel.js";   
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ Check if user already exists
        let user = await UserModel.findOne({ email });

        if (user) {
          // 2️⃣ If exists, link Google if not already linked
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = "google";
            user.avatar = profile.photos?.[0]?.value;
            await user.save();
          }

          return done(null, user);
        }

        // 3️⃣ If user does NOT exist, create new user
        user = await UserModel.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value,
          authProvider: "google",
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
