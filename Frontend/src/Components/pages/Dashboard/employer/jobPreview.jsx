import React from 'react'
import { FiX, FiDollarSign, FiMapPin, FiBriefcase, FiCalendar, FiUsers, FiTrendingUp, FiClock, FiGlobe, } from "react-icons/fi"

const JobPreview = ({ job, onClose }) => {
  if (!job) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {job.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>
                {job.salary.currency} {job.salary.min_salary} - {job.salary.max_salary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBriefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Applicants: {job.totalApplicants || 0}</span>
            </div>
            {job.experienceLevel && (
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>Experience: {job.experienceLevel}</span>
              </div>
            )}
            {job.openings && (
              <div className="flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>Openings: {job.openings}</span>
              </div>
            )}
            {job.applicationDeadline && (
              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
              </div>
            )}
            {typeof job.isRemote === "boolean" && (
              <div className="flex items-center gap-2">
                <FiGlobe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span>{job.isRemote ? "Remote Job" : "On-site Job"}</span>
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-6">
            <h3 className="text-xl font-semibold mb-3">Job Description</h3>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.Requirements && (
            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-6">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <p className="whitespace-pre-wrap">{job.Requirements}</p>
            </div>
          )}

          {job.skillsRequired && (
            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
              <h3 className="text-xl font-semibold mb-3">Skills</h3>
              {job.skillsRequired.map((skills,index) => {
                return (
                  <li className="whitespace-pre-wrap" key={index}>{skills}</li>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobPreview