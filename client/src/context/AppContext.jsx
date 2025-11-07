import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  /** ✅ Fetch user data */
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserData();
      setIsLoggedIn(true); 
    }
  }, []);

  /** ✅ Register user */
  const registerUser = async ({ fullName, email, password }) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, { fullName, email, password });
      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  /** ✅ Login user */
const loginUser = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setUserData(data);
      toast.success("Login successful!");
      return { success: true ,user: data.user};
    }

    return { success: false, message: "Login failed" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};


  /** ✅ Logout user */
  const logoutUser = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    toast.success("Signed out. Come back soon!!");
  };

  /** ✅ Update user profile */
  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const { data } = await axios.put(`${backendUrl}/api/user/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Profile updated successfully 🎉");
        setUserData(data.user);
        return data;
      } else {
        toast.error(data.message || "Profile update failed");
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return { success: false };
    }
  };

  /** ✅ Context value */
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    registerUser,
    loginUser,
    logoutUser,
    updateProfile, // ✅ Added here
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
