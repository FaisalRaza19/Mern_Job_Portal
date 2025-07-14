import React from 'react'
import { FiBriefcase, FiX, FiLogOut, FiHome, FiUsers, FiCreditCard, FiSettings } from "react-icons/fi"

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage })=>{
  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: FiHome },
    { id: "users", name: "Manage Users", icon: FiUsers },
    { id: "jobs", name: "Manage Jobs", icon: FiBriefcase },
    { id: "reports", name: "Reports & Analytics", icon: FiBriefcase },
    { id: "payments", name: "Payments", icon: FiCreditCard },
    { id: "settings", name: "Settings", icon: FiSettings },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiBriefcase className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">JobPortal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setCurrentPage(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <FiLogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
