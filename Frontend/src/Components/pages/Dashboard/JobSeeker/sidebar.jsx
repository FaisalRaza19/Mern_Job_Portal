import React from 'react'
import { FaHome } from "react-icons/fa"
import { FiHome, FiBookmark, FiFileText, FiUser, FiMessageCircle, FiSettings, FiChevronLeft, FiChevronRight, } from "react-icons/fi"
import { Link } from "react-router-dom"


const menuItems = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "saved-jobs", label: "Saved Jobs", icon: FiBookmark },
  { id: "applied-jobs", label: "Applied Jobs", icon: FiFileText },
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "messages", label: "Messages", icon: FiMessageCircle },
  { id: "settings", label: "Settings", icon: FiSettings },
]

const JobSeekerSidebar = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Link to="/"><FaHome size={16} /></Link>
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">JobSeeker</h2>}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <FiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <FiChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === item.id
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default JobSeekerSidebar