"use client"

import { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiSearch, FiDownload, FiMessageCircle, FiCheck, FiX, FiEye, FiUsers } from "react-icons/fi"

const mockApplicants = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    jobTitle: "Frontend Developer",
    appliedDate: "2024-01-15",
    status: "New",
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["React", "JavaScript", "TypeScript"],
    experience: "3 years",
    resumeUrl: "#",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    jobTitle: "UI/UX Designer",
    appliedDate: "2024-01-14",
    status: "Shortlisted",
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    experience: "5 years",
    resumeUrl: "#",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    jobTitle: "Backend Developer",
    appliedDate: "2024-01-13",
    status: "Interview",
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["Node.js", "Python", "MongoDB"],
    experience: "4 years",
    resumeUrl: "#",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    jobTitle: "Frontend Developer",
    appliedDate: "2024-01-12",
    status: "Reviewed",
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["Vue.js", "JavaScript", "CSS"],
    experience: "2 years",
    resumeUrl: "#",
  },
]

const ApplicantManagement = ()=>{
  const [applicants, setApplicants] = useState(mockApplicants)
  const [searchTerm, setSearchTerm] = useState("")
  const [jobFilter, setJobFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
      case "Reviewed":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
      case "Shortlisted":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
      case "Interview":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300"
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300"
    }
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJob = jobFilter === "all" || applicant.jobTitle === jobFilter
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter
    return matchesSearch && matchesJob && matchesStatus
  })

  const handleStatusChange = (applicantId, newStatus) => {
    setApplicants(
      applicants.map((applicant) => (applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant)),
    )
  }

  const uniqueJobs = [...new Set(applicants.map((a) => a.jobTitle))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicant Management</h1>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
            {filteredApplicants.length} applicants
          </span>
        </div>
      </div>

      {/* Filters */}
      <DashboardCard>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Jobs</option>
              {uniqueJobs.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredApplicants.map((applicant) => (
          <DashboardCard key={applicant.id} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={applicant.avatar || "/placeholder.svg"}
                    alt={applicant.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{applicant.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Applied for:</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{applicant.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Experience:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.experience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Applied:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(applicant.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {applicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedApplicant(applicant)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiEye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FiMessageCircle className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FiDownload className="w-4 h-4" />
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange(applicant.id, "Shortlisted")}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FiCheck className="w-4 h-4" />
                  <span>Shortlist</span>
                </button>
                <button
                  onClick={() => handleStatusChange(applicant.id, "Rejected")}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <FiX className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      {filteredApplicants.length === 0 && (
        <DashboardCard>
          <div className="text-center py-8">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants found</h3>
            <p className="text-gray-600 dark:text-gray-400">No applicants match your current filters.</p>
          </div>
        </DashboardCard>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedApplicant.avatar || "/placeholder.svg"}
                    alt={selectedApplicant.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedApplicant.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplicant.email}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedApplicant.status)}`}
                    >
                      {selectedApplicant.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Application Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Position:</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplicant.jobTitle}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Experience:</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplicant.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Applied Date:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedApplicant.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Status:</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplicant.status}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FiDownload className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FiMessageCircle className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedApplicant.id, "Shortlisted")
                      setSelectedApplicant(null)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>Shortlist</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedApplicant.id, "Rejected")
                      setSelectedApplicant(null)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantManagement