"use client"

import { useState } from "react"
// import { useAuth } from "../../contexts/AuthContext"
import DashboardCard from "../shared/dashboardCard.jsx"
// FiBuilding
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiEdit} from "react-icons/fi"

const EmployerOverview = ()=>{
  const { user } = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const stats = [
    { label: "Active Jobs", value: "8", icon: FiBriefcase, color: "text-blue-600" },
    { label: "Total Applications", value: "156", icon: FiUsers, color: "text-green-600" },
    { label: "Interviews Scheduled", value: "12", icon: FiCalendar, color: "text-purple-600" },
    { label: "Hires This Month", value: "3", icon: FiTrendingUp, color: "text-orange-600" },
  ]

  const recentApplications = [
    { name: "John Doe", position: "Frontend Developer", time: "2 hours ago", status: "New" },
    { name: "Jane Smith", position: "UI/UX Designer", time: "4 hours ago", status: "Reviewed" },
    { name: "Mike Johnson", position: "Backend Developer", time: "1 day ago", status: "Shortlisted" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Manage your job postings and find the best candidates.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <DashboardCard key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </DashboardCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Overview */}
        <DashboardCard
          title="Company Profile"
          action={
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          }
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FiEdit className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">Technology Company</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                  Verified Employer
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <p>San Francisco, CA</p>
                <p>Founded 2020 • 50-100 employees</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <FiBriefcase className="w-5 h-5" />
              <span className="font-medium">Post New Job</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <FiUsers className="w-5 h-5" />
              <span className="font-medium">View Applications</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <FiCalendar className="w-5 h-5" />
              <span className="font-medium">Schedule Interviews</span>
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Applications */}
      <DashboardCard title="Recent Applications">
        <div className="space-y-3">
          {recentApplications.map((application, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt={application.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{application.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{application.position}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    application.status === "New"
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                      : application.status === "Reviewed"
                        ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                        : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  }`}
                >
                  {application.status}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{application.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All Applications
        </button>
      </DashboardCard>

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Company Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  defaultValue="San Francisco, CA"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerOverview