"use client"

import { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiEye, FiSave, FiSend } from "react-icons/fi"

const PostJob = ()=>{
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    category: "",
    experience: "",
    type: "Full-time",
    description: "",
    requirements: "",
    benefits: "",
  })

  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field,value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (isDraft = false) => {
    console.log("Submitting job:", { ...formData, isDraft })
    // Handle job submission logic
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post New Job</h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FiEye className="w-4 h-4" />
          <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
        </button>
      </div>

      <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Job Form */}
        <DashboardCard title="Job Details">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Range</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="e.g. $80,000 - $120,000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (5+ years)</option>
                  <option value="lead">Lead/Principal (8+ years)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Type *
              </label>
              <div className="flex space-x-4">
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description *
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements *</label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="List the required skills, qualifications, and experience..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Benefits & Perks
              </label>
              <textarea
                rows={3}
                value={formData.benefits}
                onChange={(e) => handleInputChange("benefits", e.target.value)}
                placeholder="Health insurance, flexible hours, remote work, etc..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleSubmit(true)}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiSave className="w-4 h-4" />
                <span>Save as Draft</span>
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSend className="w-4 h-4" />
                <span>Publish Job</span>
              </button>
            </div>
          </div>
        </DashboardCard>

        {/* Live Preview */}
        {showPreview && (
          <DashboardCard title="Live Preview">
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.title || "Job Title"}</h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Your Company</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.location && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">
                      📍 {formData.location}
                    </span>
                  )}
                  {formData.type && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded">
                      {formData.type}
                    </span>
                  )}
                  {formData.experience && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded">
                      {formData.experience}
                    </span>
                  )}
                </div>
                {formData.salary && (
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{formData.salary}</p>
                )}
              </div>

              {formData.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Job Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{formData.description}</p>
                </div>
              )}

              {formData.requirements && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{formData.requirements}</p>
                </div>
              )}

              {formData.benefits && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{formData.benefits}</p>
                </div>
              )}
            </div>
          </DashboardCard>
        )}
      </div>
    </div>
  )
}

export default PostJob