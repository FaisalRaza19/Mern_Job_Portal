import React, { useState, useMemo } from 'react';
import { FiMapPin, FiBriefcase, FiDollarSign, FiExternalLink, FiLoader } from "react-icons/fi";
import { Link } from 'react-router-dom';

const FeaturedJobs = ({ jobs, loading }) => {
  const [visibleJobs, setVisibleJobs] = useState(8);

  const sortedJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    return [...jobs]
      .sort((a, b) => b.salary.max_salary - a.salary.max_salary)
      .slice(0, 20);
  }, [jobs]);

  const handleShowMore = () => {
    setVisibleJobs(prev => (prev === 8 ? 16 : 20));
  };

  const handleHideJobs = () => {
    setVisibleJobs(8);
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">High Paying Jobs</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the top 20 highest-paying jobs from leading companies.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FiLoader className="animate-spin h-10 w-10 text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {sortedJobs.slice(0, visibleJobs).map((job) => (
                <div
                  key={job._id}
                  className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col`}
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={job.company?.avatar?.avatar_Url || "/placeholder.svg"}
                          alt={`${job.company?.companyInfo?.companyName} logo`}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{job?.title || ""}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{job.company?.companyInfo?.companyName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm"><FiMapPin className="h-4 w-4 mr-2" />{job.location}</div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm"><FiBriefcase className="h-4 w-4 mr-2" />{job.employmentType}</div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <FiDollarSign className="h-4 w-4 mr-2" />
                        {`${job.salary.min_salary} - ${job.salary.max_salary} ${job.salary.currency}`}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                    <Link to={`/jobs/${job?._id}`}>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                        <span>Apply Now</span>
                        <FiExternalLink className="ml-2 h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center flex justify-center space-x-4">
              {visibleJobs < sortedJobs.length && (
                <button onClick={handleShowMore} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Show More
                </button>
              )}
              {visibleJobs > 8 && (
                <button onClick={handleHideJobs} className="bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
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