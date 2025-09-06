import React, { useState, useMemo } from "react";
import {
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiExternalLink,
  FiLoader,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const FeaturedJobs = ({ jobs, loading }) => {
  const [visibleJobs, setVisibleJobs] = useState(8);

  const sortedJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    return [...jobs]
      .sort((a, b) => b.salary.max_salary - a.salary.max_salary)
      .slice(0, 20);
  }, [jobs]);

  const handleShowMore = () => {
    setVisibleJobs((prev) => (prev === 8 ? 16 : 20));
  };

  const handleHideJobs = () => {
    setVisibleJobs(8);
  };

  return (
    <section className="relative bg-gray-50 overflow-hidden py-20">
      {/* subtle gradient overlay like Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-14">
          <h2 className="text-[42px] font-extrabold text-gray-900 mb-3">
            High Paying Jobs
          </h2>
          <p className="text-[14px] text-gray-600 max-w-2xl mx-auto">
            Discover the top 20 highest-paying jobs from leading companies.
            We’ve highlighted opportunities with the best salaries so you
            can focus on what truly matters for your career growth.
          </p>
        </div>

        {/* Loader / Empty State / Jobs */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FiLoader className="animate-spin h-10 w-10 text-blue-500" />
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="flex justify-center items-center p-12">
            <p className="text-gray-700 text-lg font-medium">
              No jobs available at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Jobs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {sortedJobs.slice(0, visibleJobs).map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    {/* Company Info */}
                    <div className="flex items-start mb-5">
                      <img
                        src={
                          job.company?.avatar?.avatar_Url || "/placeholder.svg"
                        }
                        alt={`${job.company?.companyInfo?.companyName} logo`}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="ml-3">
                        <h3 className="text-[16px] font-semibold text-gray-900 line-clamp-1">
                          {job?.title || ""}
                        </h3>
                        <p className="text-[14px] text-gray-500">
                          {job.company?.companyInfo?.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-[14px]">
                        <FiMapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600 text-[14px]">
                        <FiBriefcase className="h-4 w-4 mr-2 text-blue-500" />
                        {job.employmentType}
                      </div>
                      <div className="flex items-center text-gray-600 text-[14px]">
                        <FiDollarSign className="h-4 w-4 mr-2 text-blue-500" />
                        {`${job.salary.min_salary} - ${job.salary.max_salary} ${job.salary.currency}`}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 bg-gray-50">
                    <Link to={`/jobs/${job?._id}`}>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <span>Apply Now</span>
                        <FiExternalLink className="ml-2 h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More / Hide */}
            <div className="text-center flex justify-center space-x-4">
              {visibleJobs < sortedJobs?.length && (
                <button
                  onClick={handleShowMore}
                  className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Show More
                </button>
              )}
              {visibleJobs > 8 && (
                <button
                  onClick={handleHideJobs}
                  className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200"
                >
                  Hide Jobs
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
