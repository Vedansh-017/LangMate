import { useContext } from "react";
import './App.css'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // make sure this is imported
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Notification from './pages/Notification';
import Friend from './pages/Friend';
import ChatUI from './pages/Chat';
import SignupPage from './pages/SignUp';
import LoginPage from './pages/Login';
import ProfileSetup from './pages/ProfilePage';
import UpdateProfile from './pages/UpdateProfile';
import useSocket from "./hooks/useSocket";
import { AppContext } from "./context/AppContext";

function App() {
  const { userData } = useContext(AppContext);

  // register socket connection when userData is available
  useSocket(userData?._id);

  return (
    <div className="bg-primary min-h-screen text-white">
            <ToastContainer
        position="top-right"
        autoClose={1077} // ⏳ Duration (in ms)
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"

        // ✅ Tailwind-based styling
        toastClassName={() =>
          "relative flex items-center p-4 rounded-xl bg-white shadow-md text-gray-600 text-xs sm:text-base mb-4 "
        }
        bodyClassName={() => "text-xs sm:text-base"} // font size & family
        progressClassName="bg-orange-400" // progress bar color
      />

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/notifications' element={<Notification/>}/>
        <Route path='/friends' element={<Friend/>}/>
        <Route path="/chat/:friendId" element={<ChatUI />} />
        <Route path='/sign' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/profile' element={<ProfileSetup/>}/>
        <Route path='/update-profile' element={<UpdateProfile/>}/>
      </Routes>
    </div>
  )
}

export default App
