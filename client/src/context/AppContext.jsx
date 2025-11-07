import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  /** Fetch user data */
const getUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }
    
    const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ attach token
      },
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
  if (token) getUserData();
}, []);


  /** Register user */
  const registerUser = async ({ fullName, email, password, phone }) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, { fullName, email, password, phone});
      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  /** Login user (no OTP) */
  const loginUser = async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

     if (data.success && data.token) {
  localStorage.setItem("token", data.token); // ✅ Save token
  setIsLoggedIn(true);
  setUserData(data.user);
}


      return data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

   /**Logout user */
   const logoutUser = () => {
  localStorage.removeItem("token");
  setIsLoggedIn(false);
  setUserData(null);
  toast.success("Signed out. Come back soon!!");
};




  /** Context value */
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
  }


  return (
    <AppContext.Provider value={value}>
         {children}
    </AppContext.Provider>);
}
export default AppContextProvider;