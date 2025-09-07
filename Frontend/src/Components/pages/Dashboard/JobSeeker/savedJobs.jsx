import React, { useContext, useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import {
  FiMapPin, FiCalendar, FiBookmark, FiTrash2, FiX, FiDollarSign, FiBriefcase, FiUsers, FiTrendingUp, FiClock, FiGlobe,
} from "react-icons/fi"
import { Link } from "react-router-dom"
import { Context } from "../../../../Context/context.jsx"

const SavedJobs = ({ jobs }) => {
  const { Jobs, JobsAction } = useContext(Context)
  const { setSavedJobIds, } = JobsAction;
  const { saveJob } = Jobs
  const [savedJobs, setSavedJobs] = useState(jobs || [])
  const [showConfirmModal, setShowConfirmModal] = useState(null)
  const [previewJob, setPreviewJob] = useState(null)

  const handleUnsaveJob = async (jobId) => {
    try {
      const res = await saveJob({ jobId });
      if (res.statusCode === 200) {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        setSavedJobs((prev) => prev.filter((job) => job.jobId?._id !== jobId));
      }
    } catch (error) {
      console.error("Failed to unsave job:", error);
      alert(error.message);
    } finally {
      setShowConfirmModal(null);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600">{savedJobs.length} jobs saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <DashboardCard key={job._id} className="hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 ">{job.jobId?.title || ''}</h3>
                  <p className="text-blue-600 font-medium">
                    {job.jobId?.company?.companyInfo?.companyName || ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(job.jobId?._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 ">
                  <FiMapPin className="w-4 h-4" />
                  <span>{job.jobId?.isRemote ? "Remote" : job.jobId?.location || "World"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 ">
                  <FiCalendar className="w-4 h-4" />
                  <span>Saved on {new Date(job.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 ">
                    {job.jobId?.salary?.currency} {job.jobId?.salary?.min_salary} - {job.jobId?.salary?.max_salary}
                  </p>
                  <p className="text-sm text-gray-600 ">{job.jobId?.employmentType}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  <FiBookmark className="w-3 h-3 inline mr-1" />
                  Saved
                </span>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/jobs/${job.jobId?._id}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {job.isApplied === true ? "Applied!" : "Apply Now"}
                </Link>
                <button
                  onClick={() => setPreviewJob(job)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Preview
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
            <h3 className="text-lg font-medium text-gray-900  mb-2">No saved jobs yet</h3>
            <p className="text-gray-600 ">
              Start browsing jobs and save the ones you're interested in!
            </p>
          </div>
        </DashboardCard>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900  mb-4">Remove Saved Job</h3>
            <p className="text-gray-600  mb-6">
              Are you sure you want to remove this job from your saved list?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

      {/* Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => setPreviewJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900  mb-4">
              {previewJob.jobId?.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700">
              <div className="flex items-center gap-2">
                <FiDollarSign />
                <span>
                  {previewJob.jobId?.salary?.currency} {previewJob.jobId?.salary?.min_salary} - {previewJob.jobId?.salary?.max_salary}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin />
                <span>{previewJob.jobId?.location || "World"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBriefcase />
                <span>{previewJob.jobId?.employmentType || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>Posted: {new Date(previewJob.jobId?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers />
                <span>Applicants: {previewJob.jobId?.applicants.length || 0}</span>
              </div>
              {previewJob.jobId?.experienceLevel && (
                <div className="flex items-center gap-2">
                  <FiTrendingUp />
                  <span>Experience: {previewJob.jobId.experienceLevel}</span>
                </div>
              )}
              {previewJob.jobId?.openings && (
                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>Openings: {previewJob.jobId.openings}</span>
                </div>
              )}
              {previewJob.jobId?.applicationDeadline && (
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>Deadline: {new Date(previewJob.jobId.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
              {typeof previewJob.jobId?.isRemote === "boolean" && (
                <div className="flex items-center gap-2">
                  <FiGlobe />
                  <span>{previewJob.jobId.isRemote ? "Remote Job" : "On-site Job"}</span>
                </div>
              )}
            </div>

            <div className="text-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-2">Job Description</h3>
              <p className="whitespace-pre-wrap">{previewJob.jobId?.description || "No description provided."}</p>
            </div>

            {previewJob.jobId?.Requirements && (
              <div className="text-gray-800 mb-6">
                <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                <p className="whitespace-pre-wrap">{previewJob.jobId.Requirements}</p>
              </div>
            )}

            {previewJob.jobId?.skillsRequired?.length > 0 && (
              <div className="text-gray-800">
                <h3 className="text-xl font-semibold mb-2">Skills</h3>
                <ul className="list-disc pl-5">
                  {previewJob.jobId?.skillsRequired?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedJobs
