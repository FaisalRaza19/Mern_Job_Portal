import React, { useContext} from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaCheckCircle, FaMapMarkerAlt, FaDollarSign, FaClock, FaTag, FaBookmark, FaRegBookmark, } from "react-icons/fa";
import { Context } from "../../../Context/context";

const JobCard = ({ job }) => {
  const { Jobs, JobsAction,showAlert} = useContext(Context)
  const { savedJobIds, setSavedJobIds, appliedJobIds } = JobsAction;
  const { saveJob } = Jobs
  const isSaved = savedJobIds.includes(job._id);
  const isApplied = appliedJobIds.includes(job._id);

  const handleSaveToggle = async () => {
    try {
      const res = await saveJob({ jobId: job._id });
      showAlert(res)
      if (res.statusCode === 200) {
        setSavedJobIds((prev) =>
          isSaved ? prev.filter((id) => id !== job._id) : [...prev, job._id]
        );
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
      alert(error.message);
    }
  };


  const parseSkills = (skillsRequired) => {
    if (!Array.isArray(skillsRequired)) return [];

    try {
      const skillEntry = skillsRequired[0];
      if (typeof skillEntry === "string") {
        const parsed = JSON.parse(skillEntry.replace(/'/g, '"'));
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      return Array.isArray(skillEntry) ? skillEntry : [skillEntry];
    } catch {
      return [];
    }
  };


  const skills = parseSkills(job.skillsRequired);

  return (
    <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col transition-colors duration-300 h-full hover:shadow-lg">
      {/* Save Icon */}
      <button
        onClick={handleSaveToggle}
        className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        {isSaved === true ? (
          <FaBookmark className="w-5 h-5 text-blue-400" />
        ) : (
          <FaRegBookmark className="w-5 h-5" />
        )}
      </button>

      {/* Title */}
      <h3 className="text-xl font-semibold text-primary dark:text-blue-200 mb-2">
        {job.title || ""}
      </h3>

      {/* Company */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
        <FaBriefcase className="w-4 h-4" />
        <span>{job.company?.companyInfo?.companyName || "IT Company"}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
        <FaMapMarkerAlt className="w-4 h-4" />
        <span>{job.isRemote === false ? job.location : "Remote"}</span>
      </div>

      {/* Salary */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
        <FaDollarSign className="w-4 h-4" />
        <span>
          {job?.salary?.min_salary && job?.salary?.max_salary
            ? `${job.salary.min_salary} - ${job.salary.max_salary} ${job.salary.currency || ""}`
            : "Salary not specified"}
        </span>
      </div>

      {/* // applied FaTag */}
      {isApplied === true && (
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
          <FaCheckCircle className="w-3 h-3" />
          Applied
        </div>
      )}

      {/* Employment Type */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
        <FaClock className="w-4 h-4" />
        <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-800/30 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300">
          {job.employmentType || "Full Time"}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* View Details Button */}
      <Link to={`/jobs/${job._id}`}
        className="mt-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 h-10 px-4 py-2"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
