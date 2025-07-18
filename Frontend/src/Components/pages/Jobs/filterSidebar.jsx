import React from "react"
import {FaSearch,FaMapMarkerAlt,FaDollarSign,FaGraduationCap,FaTag,FaTimes,} from "react-icons/fa"

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    onFilterChange({ ...filters, [name]: value })
  }

  const handleSkillChange = (e) => {
    onFilterChange({ ...filters, skills: e.target.value })
  }

  const handleJobTypeChange = (type) => {
    onFilterChange({ ...filters, jobType: type })
  }

  return (
    <div className="bg-white m-2 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 sticky top-20 h-fit">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="space-y-6">
        {/* Keyword */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium mb-2">
            Keyword
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Job title, company..."
              value={filters.keyword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <div className="flex flex-wrap gap-2">
            {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
              <button
                key={type}
                onClick={() => handleJobTypeChange(type)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filters.jobType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, state, or zip"
              value={filters.location}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium mb-2">
            Experience Level
          </label>
          <div className="relative">
            <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Any</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              ▼
            </span>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Salary Range</label>
          <div className="flex gap-2">
            <div className="relative w-1/2">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="number"
                id="minSalary"
                name="minSalary"
                placeholder="Min"
                value={filters.minSalary}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative w-1/2">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="number"
                id="maxSalary"
                name="maxSalary"
                placeholder="Max"
                value={filters.maxSalary}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium mb-2">
            Skills (comma-separated)
          </label>
          <div className="relative">
            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="React, Node.js, AWS"
              value={filters.skills}
              onChange={handleSkillChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 py-2 px-4 rounded-md transition-all text-sm"
        >
          <FaTimes className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FilterSidebar
