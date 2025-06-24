"use client"

import { useState } from "react"
// import { useAuth } from "../../contexts/AuthContext"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiFileText, FiBookmark, FiTrendingUp, FiEdit, FiUpload } from "react-icons/fi"

const JobSeekerOverview = ()=>{
  const { user } = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const stats = [
    { label: "Applications Sent", value: "12", icon: FiFileText, color: "text-blue-600" },
    { label: "Saved Jobs", value: "8", icon: FiBookmark, color: "text-green-600" },
    { label: "Profile Views", value: "24", icon: FiTrendingUp, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">Ready to find your next opportunity?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        {/* Profile Overview */}
        <DashboardCard
          title="Profile Overview"
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
            <img
              src={user?.avatar || "/placeholder.svg?height=80&width=80"}
              alt={user?.name}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                  Active Job Seeker
                </span>
              </div>
              <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiFileText className="w-4 h-4" />
                <span>Resume uploaded</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Resume Status */}
        <DashboardCard title="Resume & Skills">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <FiFileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">resume.pdf</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded 2 days ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Preview</button>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {["React", "JavaScript", "TypeScript", "Node.js", "Python"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors">
              <FiUpload className="w-4 h-4" />
              <span>Update Resume</span>
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity">
        <div className="space-y-3">
          {[
            { action: "Applied to Frontend Developer at TechCorp", time: "2 hours ago" },
            { action: "Saved UI/UX Designer position at DesignStudio", time: "1 day ago" },
            { action: "Updated profile skills", time: "3 days ago" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <p className="text-gray-900 dark:text-white">{activity.action}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
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

export default JobSeekerOverview