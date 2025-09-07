import React, { useContext, useState } from "react";
import DashboardCard from "../shared/dashboardCard.jsx";
import { FiEye, FiSave, FiSend, FiLoader } from "react-icons/fi";
import CurrencyDropdown from "./currencyDropDown.jsx";
import SelectSkills from "../shared/selectSkills.jsx";
import { Context } from "../../../../Context/context.jsx";

const PostJob = ({ setJobData }) => {
  const { Jobs, showAlert } = useContext(Context)
  const { postJobs } = Jobs
  const [isLoading, setIsLoading] = useState(false)
  const initialFormState = {
    title: "",
    description: "",
    location: "",
    salary: {
      min_salary: "",
      max_salary: "",
      currency: "USD",
    },
    employmentType: "Full-Time",
    experienceLevel: "Entry",
    Requirements: "",
    skillsRequired: [],
    openings: 1,
    applicationDeadline: "",
    isRemote: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await postJobs({ formData })
      showAlert(data)
      setJobData(data?.data)
    } catch (error) {
      console.log("Error to post job", error.message)
    } finally {
      setIsLoading(false)
      setFormData(initialFormState);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiEye className="w-4 h-4" />
          <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          <DashboardCard title="Job Details">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    disabled={formData.isRemote === true}
                    type="text"
                    value={formData.isRemote === true ? "" : formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="w-full disabled:cursor-not-allowed px-3 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 "
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Salary Range</label>
                  <div className="flex gap-2">
                    <CurrencyDropdown
                      value={formData.salary.currency}
                      onChange={(currencyCode) =>
                        handleSalaryChange("currency", currencyCode)
                      }
                    />
                    <input
                      type="number"
                      value={formData.salary.min_salary}
                      onChange={(e) => handleSalaryChange("min_salary", Number(e.target.value))}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900 "
                    />
                    <input
                      type="number"
                      value={formData.salary.max_salary}
                      onChange={(e) => handleSalaryChange("max_salary", Number(e.target.value))}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900 "
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Experience Level *</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900 "
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Entry">Entry Level (0-2 years)</option>
                    <option value="Mid">Mid Level (3-5 years)</option>
                    <option value="Senior">Senior Level (5+ years)</option>
                    <option value="Lead">Lead/Principal (8+ years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Employment Type *</label>
                <div className="flex space-x-4">
                  {['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="employmentType"
                        value={type}
                        checked={formData.employmentType === type}
                        onChange={(e) => handleInputChange("employmentType", e.target.value)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 ">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Openings *</label>
                  <input
                    type="number"
                    value={formData.openings}
                    onChange={(e) => handleInputChange("openings", Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900 "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900 "
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    checked={formData.isRemote}
                    onChange={(e) => handleInputChange("isRemote", e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="text-sm text-gray-700 ">Remote</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Job Description *</label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the role and responsibilities"
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Requirements *</label>
                <textarea
                  rows={4}
                  value={formData.Requirements}
                  onChange={(e) => handleInputChange("Requirements", e.target.value)}
                  placeholder="List the required skills, qualifications..."
                  className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  resize-none"
                  required
                />
              </div>

              <SelectSkills
                userSkills={formData.skillsRequired}
                setUserSkills={(updatedSkills) =>
                  setFormData((prev) => ({ ...prev, skillsRequired: updatedSkills }))
                }
                key={formData.skillsRequired.length === 0 ? "reset" : "keep"}
              />

              <div className="flex space-x-4">
                <button
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300  text-gray-700  rounded-lg hover:bg-gray-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>
                <button type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiSend className="w-4 h-4" />
                  <span>{isLoading ? <FiLoader className="animate-spin h-6 w-6 text-blue-500" /> : "Publish Job"}</span>
                </button>
              </div>
            </div>
          </DashboardCard>

          {showPreview && (
            <DashboardCard title="Live Preview">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 ">{formData.title || "Job Title"}</h2>
                  <p className="text-blue-600 font-medium">Your Company</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.location && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700  text-sm rounded">
                        📍 {formData.location}
                      </span>
                    )}
                    {formData.employmentType && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                        {formData.employmentType}
                      </span>
                    )}
                    {formData.experienceLevel && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                        {formData.experienceLevel}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">
                      Openings: {formData.openings}
                    </span>
                    {formData.applicationDeadline && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                        Deadline: {formData.applicationDeadline}
                      </span>
                    )}
                    {formData.isRemote && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                        Remote
                      </span>
                    )}
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900  mb-2">Job Description</h3>
                    <p className="text-gray-700  whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}

                {formData.Requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900  mb-2">Requirements</h3>
                    <p className="text-gray-700  whitespace-pre-wrap">{formData.Requirements}</p>
                  </div>
                )}

                {formData.skillsRequired.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900  mb-2">Required Skills</h3>
                    <ul className="list-disc list-inside text-gray-700 ">
                      {formData.skillsRequired.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DashboardCard>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJob;
