import React from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaTag, } from "react-icons/fa";

const JobCard = ({ job }) => {
  const parseSkills = (skillsRequired) => {
    if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) return [];

    const firstEntry = skillsRequired[0];

    // If it's already a real array, return it
    if (Array.isArray(firstEntry)) return firstEntry;

    // If it's a stringified array like "['React','js']"
    if (typeof firstEntry === "string" && firstEntry.includes("[")) {
      try {
        return JSON.parse(firstEntry.replace(/'/g, '"'));
      } catch (err) {
        console.warn("Failed to parse skills:", firstEntry);
        return [];
      }
    }

    // If it's a plain string like "web dev"
    return [firstEntry];
  };

  const skills = parseSkills(job.skillsRequired);
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col gap-4 transition-colors duration-300">
      <h3 className="text-xl font-semibold text-primary dark:text-blue-200">{job.title || ""}</h3>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
        <FaBriefcase className="w-4 h-4" />
        <span>{job.company.companyInfo.companyName || "IT Company"}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
        <FaMapMarkerAlt className="w-4 h-4" />
        <span>{job.isRemote === false ? job.location : "Remote" || ""}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
        <FaDollarSign className="w-4 h-4" />
        <span>
          {job?.salary?.min_salary && job?.salary?.max_salary
            ? `${job.salary.min_salary} - ${job.salary.max_salary} ${job.salary.currency || ""}`
            : "Salary not specified"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
        <FaClock className="w-4 h-4" />
        <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-800/30 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300">
          {job.employmentType || "Full Time"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-100"
          >
            <FaTag className="w-3 h-3 mr-1" />
            {skill}
          </span>
        ))}
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 h-10 px-4 py-2 mt-auto"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
