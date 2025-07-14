import React from 'react'
import { useState } from "react"
import Sidebar from "./Admin Components/Sidebar.jsx"
import Navbar from "./Admin Components/Navbar.jsx"
import Dashboard from "./Admin Components/Dashboard.jsx"
import UserPage from "./Admin Components/UserPage.jsx"
import Jobs from "./Admin Components/Jobs.jsx"
import Reports from "./Admin Components/Reports.jsx"
import Payments from "./Admin Components/Payments.jsx"
import Setting from "./Admin Components/Setting.jsx"
import { FiUsers, FiBriefcase, FiTrendingUp, FiDollarSign } from "react-icons/fi"

const Admin = ()=>{
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Data for pages (can be moved to a separate data file if preferred)
  const statsData = [
    { title: "Total Users", value: "15,847", change: "+12%", icon: FiUsers, color: "bg-blue-500" },
    { title: "Total Jobs", value: "3,429", change: "+8%", icon: FiBriefcase, color: "bg-green-500" },
    { title: "Active Employers", value: "1,234", change: "+15%", icon: FiTrendingUp, color: "bg-purple-500" },
    { title: "Monthly Revenue", value: "$45,678", change: "+23%", icon: FiDollarSign, color: "bg-orange-500" },
  ]

  const recentActivities = [
    { type: "User Registration", user: "John Doe", time: "2 minutes ago", action: "registered as Job Seeker" },
    { type: "Job Posted", user: "TechCorp Inc.", time: "15 minutes ago", action: "posted Senior Developer position" },
    { type: "Payment", user: "StartupXYZ", time: "1 hour ago", action: "upgraded to Premium plan" },
    { type: "User Registration", user: "Jane Smith", time: "2 hours ago", action: "registered as Employer" },
    { type: "Job Application", user: "Mike Johnson", time: "3 hours ago", action: "applied for UX Designer role" },
  ]

  const usersData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Job Seeker",
      status: "Active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "TechCorp Inc.",
      email: "hr@techcorp.com",
      role: "Employer",
      status: "Active",
      joinDate: "2024-01-10",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Job Seeker",
      status: "Inactive",
      joinDate: "2024-01-08",
    },
    {
      id: 4,
      name: "StartupXYZ",
      email: "contact@startupxyz.com",
      role: "Employer",
      status: "Active",
      joinDate: "2024-01-05",
    },
    {
      id: 5,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "Job Seeker",
      status: "Banned",
      joinDate: "2024-01-03",
    },
  ]

  const jobsData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      status: "Active",
      posted: "2024-01-15",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "Full-time",
      status: "Active",
      posted: "2024-01-14",
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "Remote",
      type: "Contract",
      status: "Closed",
      posted: "2024-01-12",
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "Boston, MA",
      type: "Full-time",
      status: "Active",
      posted: "2024-01-10",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Seattle, WA",
      type: "Full-time",
      status: "Pending",
      posted: "2024-01-08",
    },
  ]

  const paymentsData = [
    { id: 1, employer: "TechCorp Inc.", amount: "$299", plan: "Premium", date: "2024-01-15", status: "Completed" },
    { id: 2, employer: "StartupXYZ", amount: "$99", plan: "Basic", date: "2024-01-14", status: "Completed" },
    { id: 3, employer: "Design Studio", amount: "$199", plan: "Standard", date: "2024-01-12", status: "Pending" },
    { id: 4, employer: "Analytics Pro", amount: "$299", plan: "Premium", date: "2024-01-10", status: "Completed" },
    { id: 5, employer: "CloudTech", amount: "$99", plan: "Basic", date: "2024-01-08", status: "Failed" },
  ]

  const chartData = [
    { month: "Jan", jobs: 120 },
    { month: "Feb", jobs: 150 },
    { month: "Mar", jobs: 180 },
    { month: "Apr", jobs: 220 },
    { month: "May", jobs: 280 },
    { month: "Jun", jobs: 320 },
  ]

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard statsData={statsData} recentActivities={recentActivities} chartData={chartData} />
      case "users":
        return <UserPage usersData={usersData} />
      case "jobs":
        return <Jobs jobsData={jobsData} />
      case "reports":
        return <Reports statsData={statsData} chartData={chartData} />
      case "payments":
        return <Payments paymentsData={paymentsData} />
      case "settings":
        return <Setting />
      default:
        return <Dashboard statsData={statsData} recentActivities={recentActivities} chartData={chartData} />
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="lg:ml-64">
          <Navbar
            currentPage={currentPage}
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="p-6">{renderCurrentPage()}</main>
        </div>
      </div>
    </div>
  )
}

export default Admin
