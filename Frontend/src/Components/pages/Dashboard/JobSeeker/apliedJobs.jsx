"use client"

import { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiSearch, FiCalendar, FiMapPin } from "react-icons/fi"


const mockAppliedJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    appliedDate: "2024-01-15",
    status: "Shortlisted",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "New York, NY",
    appliedDate: "2024-01-14",
    status: "Pending",
  },
  {
    id: "3",
    title: "React Developer",
    company: "StartupXYZ",
    location: "Remote",
    appliedDate: "2024-01-13",
    status: "Interview",
  },
  {
    id: "4",
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Austin, TX",
    appliedDate: "2024-01-12",
    status: "Rejected",
  },
]

const AppliedJobs = ()=>{
  const [appliedJobs] = useState(mockAppliedJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
      case "Shortlisted":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
      case "Interview":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300"
    }
  }

  const filteredJobs = appliedJobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        case "company":
          return a.company.localeCompare(b.company)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applied Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400">{appliedJobs.length} applications</p>
      </div>

      {/* Filters */}
      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Jobs Table */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Job Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Company</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Applied Date</th>
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
                    <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(job.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No applications found matching your criteria.</p>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}

export default AppliedJobs