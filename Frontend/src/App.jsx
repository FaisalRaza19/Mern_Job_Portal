import React, { useState, useEffect, useContext } from "react";
import Alert from "./Components/Forms/alert.jsx";
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
import ChangePass from "./Components/Forms/ChangePass.jsx"
import { Routes, Route, useLocation, Navigate,matchPath } from "react-router-dom";
import JobSeekerDashboard from "./Components/pages/Dashboard/JobSeeker/dashboard.jsx";
import EmployerDashboard from "./Components/pages/Dashboard/employer/employerDashboard.jsx";
import { Context } from "./Context/context.jsx";


function App() {
  const { isEmployer, verifyUser } = useContext(Context);
  const { isLoggedIn, setIsLoggedIn } = verifyUser;
  const authPage = useLocation();
  const isChangePasswordPage = matchPath("/change-password/:token", authPage.pathname);
  const isAuthPage = [
    "/login",
    "/register",
    "/email-verify",
    "/change-password/:token",
    "/jobseeker-dashboard",
    "/admin",
    "/employer-dashboard",
  ].includes(authPage.pathname) || isChangePasswordPage;

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
      <div className="bg-white text-gray-900 transition-colors duration-300">
        <Alert />
        {!isAuthPage && (
          <Navbar
            isEmployer={isEmployer}
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
          <Route path="/change-password" element={<h1>change password</h1>} />
        </Routes>
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}

export default App;
