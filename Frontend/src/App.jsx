import React, { useState, useEffect } from "react";
import Navbar from "./Components/pages/Fixed Pages/Navbar.jsx";
import Footer from "./Components/pages/Fixed Pages/Footer.jsx";
import HomePage from "./Components/pages/Home/HomePage.jsx";
import Login from "./Components/Forms/login.jsx"
import Register from "./Components/Forms/Register.jsx"
import { Routes, Route} from "react-router-dom"


function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedLoginState = localStorage.getItem("isLoggedIn")

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
    if (savedLoginState) {
      setIsLoggedIn(JSON.parse(savedLoginState))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn))
  }, [isLoggedIn])

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn}/>}/>
          </Routes>
        <Footer/>
      </div>
    </div>
  )
}

export default App
