import React, { useState } from "react";
import DashboardCard from "../shared/dashboardCard.jsx";
import {
  FiSearch, FiCalendar, FiMapPin, FiX, FiDollarSign,
  FiBriefcase, FiUsers, FiTrendingUp, FiClock, FiGlobe,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const AppliedJobs = ({ jobs, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedJob, setSelectedJob] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-blue-100 text-blue-800";
      case "Hired":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredJobs = jobs?.filter((job) => {
      const titleMatch = job?.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const companyMatch = job?.jobId?.company?.companyInfo?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        job?.jobId?.applicants?.find((e) => e?.User === userId).status === statusFilter;
      return (titleMatch || companyMatch) && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.appliedDate) - new Date(a.appliedDate);
      }
      if (sortBy === "company") {
        return a.jobId.company.companyInfo.companyName.localeCompare(
          b.jobId.company.companyInfo.companyName
        );
      }
      if (sortBy === "status") {
        return a.jobId.status.localeCompare(b.jobId.status);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Applied Jobs</h1>
        <p className="text-gray-600">{jobs?.length} applications</p>
      </div>

      {/* Filters */}
      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Job Table */}
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Job Title</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Company</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Location</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Applied</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs?.map((job) => {
                const applicant = job?.jobId?.applicants.find((e) => e?.User === userId);
                return (
                  <tr
                    key={job?.jobId._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <Link to={`/jobs/${job?.jobId?._id}`} className="hover:underline">
                      <td className="py-4 px-4 text-gray-900 font-medium">{job?.jobId?.title || "title"}</td>
                    </Link>
                    <td className="py-4 px-4 text-blue-600 font-medium">
                      {job?.jobId?.company?.companyInfo?.companyName || "Company"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <FiMapPin className="inline w-4 h-4 mr-1" />
                      {job?.jobId?.isRemote ? "Remote" : job?.jobId?.location || "New York"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <FiCalendar className="inline w-4 h-4 mr-1" />
                      {new Date(applicant?.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full ${getStatusColor(
                          job?.jobId?.applicants?.find((e) => e?.User === userId).status
                        )}`}
                      >
                        {job?.jobId?.applicants?.find((e) => e?.User === userId).status || ""}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedJob(job?.jobId)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredJobs?.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No matching applications found.
          </div>
        )}
      </DashboardCard>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedJob?.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <FiDollarSign /> {selectedJob?.salary?.currency}{" "}
                {selectedJob?.salary?.min_salary} - {selectedJob?.salary?.max_salary}
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin /> {selectedJob?.isRemote ? "Remote" : selectedJob?.location}
              </div>
              <div className="flex items-center gap-2">
                <FiBriefcase /> {selectedJob?.employmentType}
              </div>
              <div className="flex items-center gap-2">
                <FiUsers /> Applicants: {selectedJob?.applicants?.length || 0}
              </div>
              {selectedJob?.experienceLevel && (
                <div className="flex items-center gap-2">
                  <FiTrendingUp /> {selectedJob?.experienceLevel}
                </div>
              )}
              {selectedJob?.applicationDeadline && (
                <div className="flex items-center gap-2">
                  <FiClock /> Deadline:{" "}
                  {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FiGlobe /> {selectedJob?.isRemote ? "Remote" : "On-site"}
              </div>
            </div>

            <div className="text-gray-800 mb-6">
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="whitespace-pre-wrap">
                {selectedJob?.description || "No description provided."}
              </p>
            </div>

            {selectedJob?.Requirements && (
              <div className="text-gray-800 mb-6">
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <p className="whitespace-pre-wrap">{selectedJob?.Requirements}</p>
              </div>
            )}

            {selectedJob?.skillsRequired?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Skills</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-800">
                  {selectedJob?.skillsRequired?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
