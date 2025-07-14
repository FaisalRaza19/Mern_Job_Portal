import React, { useState, useEffect, useContext } from "react";
import Admin from "./Components/pages/admin/Admin.jsx"
import Navbar from "./Components/pages/Fixed Pages/Navbar.jsx";
import Footer from "./Components/pages/Fixed Pages/Footer.jsx";
import About from "./Components/pages/Fixed Pages/About.jsx";
import Contact from "./Components/pages/Fixed Pages/Contact.jsx";
import HomePage from "./Components/pages/Home/HomePage.jsx";
import Login from "./Components/Forms/login.jsx"
import Register from "./Components/Forms/Register.jsx"
import EmailVerify from "./Components/Forms/emailVerify.jsx"
import { Routes, Route, useLocation, Navigate, useNavigate} from "react-router-dom"
import JobSeekerDashboard from "./Components/pages/Dashboard/JobSeeker/dashboard.jsx"
import EmployerDashboard from "./Components/pages/Dashboard/employer/employerDashboard.jsx"
import { Context } from "./Context/context.jsx";

function App() {
  const { isEmployer,verifyUser} = useContext(Context);
  const {isLoggedIn,setIsLoggedIn} = verifyUser
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate();
  const authPage = useLocation()
  const isAuthPage = ["/login", "/register", "/email-verify", "/jobseeker-dashboard","/admin", "/employer-dashboard"].includes(authPage.pathname)
 
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // useEffect(() => {
  //   localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn))
  // }, [isLoggedIn])

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {!isAuthPage && <Navbar isEmployer={isEmployer} darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/jobseeker-dashboard" element={isLoggedIn ? <JobSeekerDashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />} />
          <Route path="/employer-dashboard" element={isLoggedIn ? <EmployerDashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" replace />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/email-verify" element={<EmailVerify setIsLogedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
        {!isAuthPage && <Footer />}
      </div >
    </div >
  )
}

export default App
