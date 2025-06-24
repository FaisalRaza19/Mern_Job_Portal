"use client"

import { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiCalendar, FiMoreVertical } from "react-icons/fi"

const mockJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    postedOn: "2024-01-15",
    totalApplicants: 45,
    status: "Active",
    salary: "$80,000 - $120,000",
    type: "Full-time",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    location: "New York, NY",
    postedOn: "2024-01-14",
    totalApplicants: 32,
    status: "Active",
    salary: "$70,000 - $100,000",
    type: "Full-time",
  },
  {
    id: "3",
    title: "Backend Developer",
    location: "Remote",
    postedOn: "2024-01-13",
    totalApplicants: 28,
    status: "Paused",
    salary: "$90,000 - $130,000",
    type: "Contract",
  },
  {
    id: "4",
    title: "Product Manager",
    location: "Austin, TX",
    postedOn: "2024-01-12",
    totalApplicants: 0,
    status: "Draft",
    salary: "$100,000 - $150,000",
    type: "Full-time",
  },
]

const ManageJobs = ()=>{
  const [jobs, setJobs] = useState(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [showActionMenu, setShowActionMenu] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
      case "Draft":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
      case "Paused":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300"
      case "Closed":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300"
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId))
    setShowDeleteModal(null)
  }

  const handleStatusChange = (jobId,newStatus) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
    setShowActionMenu(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Post New Job
        </button>
      </div>

      {/* Filters */}
      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </DashboardCard>

      {/* Jobs Table */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Job Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Posted On</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Applicants</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {job.salary} • {job.type}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 dark:text-gray-400">{job.location}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(job.postedOn).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <FiUsers className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{job.totalApplicants}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button title="View Details" className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button title="Edit Job" className="p-1 text-gray-500 hover:text-green-600 transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Job"
                        onClick={() => setShowDeleteModal(job.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === job.id ? null : job.id)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                        {showActionMenu === job.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <div className="p-1">
                              {job.status !== "Active" && (
                                <button
                                  onClick={() => handleStatusChange(job.id, "Active")}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  Activate
                                </button>
                              )}
                              {job.status !== "Paused" && (
                                <button
                                  onClick={() => handleStatusChange(job.id, "Paused")}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  Pause
                                </button>
                              )}
                              {job.status !== "Closed" && (
                                <button
                                  onClick={() => handleStatusChange(job.id, "Closed")}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  Close
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        )}
      </DashboardCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Job Posting</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageJobs