import React, { useContext, useState, useEffect } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiCalendar, FiMoreVertical, FiLoader } from "react-icons/fi"
import JobPreviewModal from "./jobPreview.jsx"
import JobEditFormModal from "./editJobs.jsx"
import { Context } from "../../../../Context/context.jsx"


const ManageJobs = ({ setActiveTab }) => {
  const { Jobs, showAlert } = useContext(Context)
  const { delJob, changeStatus, getAllJobs } = Jobs
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(null)
  const [showEditModal, setShowEditModal] = useState(null)

  // get all jobs of user
  const JobsData = async () => {
    try {
      setIsLoading(true)
      const data = await getAllJobs()
      if (data.statusCode === 200) {
        setJobs(data.data)
      }
    } catch (error) {
      console.log("Error of get all jobs of user", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    JobsData()
  }, [])


  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Paused":
        return "bg-orange-100 text-orange-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteJob = async (jobId) => {
    try {
      setIsLoading(true)
      const data = await delJob(jobId);
      showAlert(data)
      setJobs(jobs?.filter((job) => job._id !== jobId))
      setShowDeleteModal(null)
    } catch (error) {
      console.log("Error to del the job", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // change application status
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const Data = { status: newStatus, jobId }
      const data = await changeStatus({ Data })
      showAlert(data)
      if (data?.statusCode === 200) {
        setJobs(jobs?.map((job) => (job?._id === jobId ? { ...job, status: newStatus } : job)))
        setShowActionMenu(null)
      }
    } catch (error) {
      console.log("error during change status", error.message)
    }
  }

  const handleJobUpdate = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs?.map((job) => (job?._id === updatedJob._id ? updatedJob : job))
    )
    setShowEditModal(null)
  }

  const jobToPreview = showPreviewModal ? jobs.find((job) => job._id === showPreviewModal) : null
  const jobToEdit = showEditModal ? jobs.find((job) => job._id === showEditModal) : null

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
        <button
          onClick={() => setActiveTab("post-job")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 "
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900  w-full md:w-[180px] pr-8"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pause">Paused</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Jobs Table */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 ">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  Posted On
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  Applicants
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                    <p className="mt-2 text-gray-500">Loading jobs...</p>
                  </td>
                </tr>
              ) : filteredJobs?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredJobs?.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 ">{job?.title || ""}</div>
                        <div className="text-xs text-gray-600">
                          {job?.salary?.currency + " " + job?.salary?.min_salary + "-" + job?.salary?.max_salary} •{" "}
                          {job?.employmentType}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{job.isRemote === true ? "Remote" : job.location}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm">
                        <FiUsers className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 ">{job?.applicants.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job?.status)}`}
                      >
                        {job?.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                          onClick={() => setShowPreviewModal(job?._id)}
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                          <span className="sr-only">View Details</span>
                        </button>
                        <button
                          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors"
                          onClick={() => setShowEditModal(job?._id)}
                          title="Edit Job"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span className="sr-only">Edit Job</span>
                        </button>
                        <button
                          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
                          onClick={() => setShowDeleteModal(job?._id)}
                          title="Delete Job"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span className="sr-only">Delete Job</span>
                        </button>
                        <div className="relative">
                          <button
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            onClick={() => setShowActionMenu(showActionMenu === job._id ? null : job._id)}
                            title="More Actions"
                          >
                            <FiMoreVertical className="w-4 h-4" />
                            <span className="sr-only">More Actions</span>
                          </button>
                          {showActionMenu === job._id && (
                            <ul className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                              {job.status !== "Active" && (
                                <li>
                                  <button
                                    onClick={() => handleStatusChange(job._id, "Active")}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700  hover:bg-gray-100 rounded-md"
                                  >
                                    Activate
                                  </button>
                                </li>
                              )}
                              {job.status !== "Pause" && (
                                <li>
                                  <button
                                    onClick={() => handleStatusChange(job._id, "Pause")}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700  hover:bg-gray-100 rounded-md"
                                  >
                                    Pause
                                  </button>
                                </li>
                              )}
                              {job.status !== "Closed" && (
                                <li>
                                  <button
                                    onClick={() => handleStatusChange(job._id, "Closed")}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700  hover:bg-gray-100 rounded-md"
                                  >
                                    Close
                                  </button>
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Delete Confirmation Modal */}
      {!!showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Delete Job Posting</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700  rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {isLoading ? <FiLoader className="animate-spin h-8 w-8 text-blue-500 mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Preview Modal */}
      {jobToPreview && <JobPreviewModal job={jobToPreview} onClose={() => setShowPreviewModal(null)} />}

      {/* Job Edit Form Modal */}
      {jobToEdit && <JobEditFormModal job={jobToEdit} onUpdate={handleJobUpdate} onClose={() => setShowEditModal(null)} />}
    </div>
  )
}

export default ManageJobs
