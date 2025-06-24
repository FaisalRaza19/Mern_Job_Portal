"use client"

import { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiMapPin, FiCalendar, FiBookmark, FiTrash2 } from "react-icons/fi"


const mockSavedJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    dateSaved: "2024-01-15",
    salary: "$80,000 - $120,000",
    type: "Full-time",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "New York, NY",
    dateSaved: "2024-01-14",
    salary: "$70,000 - $100,000",
    type: "Full-time",
  },
  {
    id: "3",
    title: "React Developer",
    company: "StartupXYZ",
    location: "Remote",
    dateSaved: "2024-01-13",
    salary: "$90,000 - $130,000",
    type: "Contract",
  },
]

const SavedJobs = ()=>{
  const [savedJobs, setSavedJobs] = useState(mockSavedJobs)
  const [showConfirmModal, setShowConfirmModal] = useState(null)

  const handleUnsaveJob = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId))
    setShowConfirmModal(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">{savedJobs.length} jobs saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <DashboardCard key={job.id} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(job.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiMapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar className="w-4 h-4" />
                  <span>Saved on {new Date(job.dateSaved).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{job.salary}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.type}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-full">
                  <FiBookmark className="w-3 h-3 inline mr-1" />
                  Saved
                </span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      {savedJobs.length === 0 && (
        <DashboardCard>
          <div className="text-center py-8">
            <FiBookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved jobs yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start browsing jobs and save the ones you're interested in!
            </p>
          </div>
        </DashboardCard>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Remove Saved Job</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove this job from your saved list?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnsaveJob(showConfirmModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedJobs