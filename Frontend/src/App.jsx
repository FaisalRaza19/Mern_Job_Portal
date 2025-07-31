import React, { useState, useEffect, useContext } from "react";
import Alert from "./Components/Forms/alert.jsx";
import Admin from "./Components/pages/admin/Admin.jsx";
import Navbar from "./Components/pages/Fixed Pages/Navbar.jsx";
import Footer from "./Components/pages/Fixed Pages/Footer.jsx";
import About from "./Components/pages/Fixed Pages/About.jsx";
import JobContent from "./Components/pages/Jobs/jobContent.jsx";
import JobDetails from "./Components/pages/Jobs/jobDetails.jsx";
import Companies from "./Components/pages/Companies/Companies.jsx";
import CompanyDetail from "./Components/pages/Companies/CompanyDetails.jsx";
import Contact from "./Components/pages/Fixed Pages/Contact.jsx";
import HomePage from "./Components/pages/Home/HomePage.jsx";
import Login from "./Components/Forms/login.jsx";
import Register from "./Components/Forms/Register.jsx";
import EmailVerify from "./Components/Forms/emailVerify.jsx";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import JobSeekerDashboard from "./Components/pages/Dashboard/JobSeeker/dashboard.jsx";
import EmployerDashboard from "./Components/pages/Dashboard/employer/employerDashboard.jsx";
import { Context } from "./Context/context.jsx";

function App() {
  const { isEmployer, verifyUser } = useContext(Context);
  const { isLoggedIn, setIsLoggedIn } = verifyUser;
  const [darkMode, setDarkMode] = useState(true);
  const authPage = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/email-verify",
    "/jobseeker-dashboard",
    "/admin",
    "/employer-dashboard",
  ].includes(authPage.pathname);

  // Load saved or system preference dark mode on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode and save to localStorage on change
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Alert />
        {!isAuthPage && (
          <Navbar
            isEmployer={isEmployer}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isLoggedIn={isLoggedIn}
          />
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobContent />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:companyId" element={<CompanyDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/jobseeker-dashboard"
            element={
              isLoggedIn ? (
                <JobSeekerDashboard setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/employer-dashboard"
            element={
              isLoggedIn ? (
                <EmployerDashboard setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/email-verify"
            element={<EmailVerify setIsLogedIn={setIsLoggedIn} />}
          />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}

export default App;
