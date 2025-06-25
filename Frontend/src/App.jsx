import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Components/pages/Fixed Pages/Navbar.jsx";
import Footer from "./Components/pages/Fixed Pages/Footer.jsx";
import HomePage from "./Components/pages/Home/HomePage.jsx";
import Login from "./Components/Forms/login.jsx"
import Register from "./Components/Forms/Register.jsx"
import EmailVerify from "./Components/Forms/emailVerify.jsx"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import JobSeekerDashboard from "./Components/pages/Dashboard/JobSeeker/dashboard.jsx"
import EmployerDashboard from "./Components/pages/Dashboard/employer/employerDashboard.jsx"
import { Context } from "./Context/context.jsx";

function App() {
  const {isEmployer} = useContext(Context);
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const authPage = useLocation()
  const isAuthPage = ["/login", "/register", "/email-verify", "/jobseeker-dashboard", "/employer-dashboard"].includes(authPage.pathname)


  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const token = localStorage.getItem("user_token");
    if (!token || token === "undefined" || token === null) {
      setIsLoggedIn(false);
      localStorage.removeItem("user_token");
    } else {
      setIsLoggedIn(true);
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
        {!isAuthPage && <Navbar isEmployer={isEmployer} darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobseeker-dashboard" element={isLoggedIn ? <JobSeekerDashboard setIsLoggedIn={setIsLoggedIn}/> : <Navigate to="/" replace />} />
          <Route path="/employer-dashboard" element={isLoggedIn ? <EmployerDashboard setIsLoggedIn={setIsLoggedIn}/> : <Navigate to="/" replace />} />
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
