import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaDollarSign,
  FaGraduationCap,
  FaTag,
  FaTimes,
} from "react-icons/fa";

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSkillChange = (e) => {
    onFilterChange({ ...filters, skills: e.target.value });
  };

  const handleJobTypeChange = (type) => {
    onFilterChange({ ...filters, jobType: type });
  };

  return (
    <aside className="bg-white shadow-lg rounded-2xl m-3 p-4 border border-gray-200 sticky top-16 h-fit transition-all duration-300">
      <div className="space-y-8">
        {/* Keyword */}
        <div>
          <label htmlFor="keyword" className="block text-[14px] font-medium mb-2 text-gray-700">
            Keyword
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Job title, company..."
              value={filters.keyword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-[14px] font-medium mb-2 text-gray-700">Job Type</label>
          <div className="flex flex-wrap gap-2">
            {["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"].map((type) => (
              <button
                key={type}
                onClick={() => handleJobTypeChange(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.jobType === type
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Remote */}
        <div>
          <label htmlFor="location" className="block text-[14px] font-medium mb-2 text-gray-700">
            Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, Country"
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              disabled={filters.isRemote}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="isRemote"
              name="isRemote"
              checked={filters.isRemote}
              onChange={(e) => onFilterChange({ ...filters, isRemote: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isRemote" className="text-[14px] text-gray-600">
              Remote only
            </label>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-[14px] font-medium mb-2 text-gray-700">
            Experience Level
          </label>
          <div className="relative">
            <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
              <option value="">Any</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-[14px] font-medium mb-2 text-gray-700">Salary Range</label>
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                id="minSalary"
                name="minSalary"
                placeholder="Min"
                value={filters.minSalary}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative w-1/2">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                id="maxSalary"
                name="maxSalary"
                placeholder="Max"
                value={filters.maxSalary}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-[14px] font-medium mb-2 text-gray-700">
            Skills
          </label>
          <div className="relative">
            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="React, Node.js, AWS"
              value={filters.skills}
              onChange={handleSkillChange}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
        >
          <FaTimes className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
