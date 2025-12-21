import { useContext } from "react";
import './App.css'
import { Route, Routes } from "react-router-dom";
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/notifications' element={<Notification/>}/>
        <Route path='/friends' element={<Friend/>}/>
        <Route path='/chat' element={<ChatUI/>}/>
        <Route path='/sign' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/profile' element={<ProfileSetup/>}/>
        <Route path='/update-profile' element={<UpdateProfile/>}/>
      </Routes>
    </div>
  )
}

export default App
