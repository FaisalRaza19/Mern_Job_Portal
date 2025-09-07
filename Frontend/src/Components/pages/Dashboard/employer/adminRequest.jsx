import React,{ useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiPlus, FiClock, FiCheck, FiX, FiEye } from "react-icons/fi"

const mockRequests = [
  {
    id: "1",
    type: "job_approval",
    title: "Senior Full Stack Developer Position",
    description: "Request approval for posting a senior full stack developer position with competitive salary package.",
    status: "Pending",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    type: "account_verification",
    title: "Company Verification Request",
    description: "Request for company verification badge to increase credibility with job seekers.",
    status: "Under Review",
    submittedDate: "2024-01-14",
  },
  {
    id: "3",
    type: "job_approval",
    title: "Remote React Developer",
    description: "Approval request for remote React developer position with flexible working hours.",
    status: "Approved",
    submittedDate: "2024-01-13",
    responseDate: "2024-01-14",
    adminNotes: "Job posting approved. All requirements met.",
  },
  {
    id: "4",
    type: "feature_request",
    title: "Bulk Application Management",
    description: "Request for feature to manage multiple applications at once for better efficiency.",
    status: "Rejected",
    submittedDate: "2024-01-12",
    responseDate: "2024-01-13",
    adminNotes: "Feature not currently in development roadmap.",
  },
]

const AdminRequests = ()=>{
  const [requests, setRequests] = useState(mockRequests)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [newRequest, setNewRequest] = useState({
    type: "job_approval",
    title: "",
    description: "",
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Under Review":
        return "bg-blue-100 text-blue-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FiClock className="w-4 h-4" />
      case "Under Review":
        return <FiEye className="w-4 h-4" />
      case "Approved":
        return <FiCheck className="w-4 h-4" />
      case "Rejected":
        return <FiX className="w-4 h-4" />
      default:
        return <FiClock className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "job_approval":
        return "Job Approval"
      case "account_verification":
        return "Account Verification"
      case "feature_request":
        return "Feature Request"
      default:
        return type
    }
  }

  const handleSubmitRequest = () => {
    if (newRequest.title && newRequest.description) {
      const request = {
        id: Date.now().toString(),
        ...newRequest,
        status: "Pending",
        submittedDate: new Date().toISOString().split("T")[0],
      }
      setRequests([request, ...requests])
      setNewRequest({ type: "job_approval", title: "", description: "" })
      setShowNewRequestModal(false)
    }
  }

  const pendingCount = requests.filter((r) => r.status === "Pending").length
  const underReviewCount = requests.filter((r) => r.status === "Under Review").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Requests</h1>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-600" />
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">{underReviewCount}</p>
            </div>
            <FiEye className="w-8 h-8 text-blue-600" />
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 ">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 ">{requests.length}</p>
            </div>
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
        </DashboardCard>
      </div>

      {/* Requests List */}
      <DashboardCard title="Recent Requests">
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {getTypeLabel(request.type)}
                    </span>
                    <span
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                    >
                      {getStatusIcon(request.status)}
                      <span>{request.status}</span>
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900  mb-1">{request.title}</h3>
                  <p className="text-gray-600  text-sm mb-2">{request.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 ">
                    <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                    {request.responseDate && (
                      <span>Responded: {new Date(request.responseDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  {request.adminNotes && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <p className="font-medium text-blue-800">Admin Notes:</p>
                      <p className="text-blue-700">{request.adminNotes}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="ml-4 p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 ">No requests submitted yet.</p>
          </div>
        )}
      </DashboardCard>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Submit New Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Request Type</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                >
                  <option value="job_approval">Job Approval</option>
                  <option value="account_verification">Account Verification</option>
                  <option value="feature_request">Feature Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                  placeholder="Enter request title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Description</label>
                <textarea
                  rows={4}
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900  resize-none"
                  placeholder="Provide detailed description of your request"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700  rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={!newRequest.title || !newRequest.description}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 ">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 bg-gray-100  text-gray-700  text-sm rounded">
                  {getTypeLabel(selectedRequest.type)}
                </span>
                <span
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}
                >
                  {getStatusIcon(selectedRequest.status)}
                  <span>{selectedRequest.status}</span>
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900  mb-2">{selectedRequest.title}</h4>
                <p className="text-gray-600 ">{selectedRequest.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900 ">Submitted Date:</p>
                  <p className="text-gray-600 ">
                    {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                {selectedRequest.responseDate && (
                  <div>
                    <p className="font-medium text-gray-900 ">Response Date:</p>
                    <p className="text-gray-600 ">
                      {new Date(selectedRequest.responseDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {selectedRequest.adminNotes && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Admin Notes:</h5>
                  <p className="text-blue-700 ">{selectedRequest.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRequests