import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiLoader, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { debounce } from 'lodash';

const Hero = ({ jobs }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filteredJobs = jobs.filter(job => {
      const companyName = job.company?.companyInfo?.companyName || "";
      return job.title.toLowerCase().includes(query.toLowerCase()) ||
        companyName.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase());
    });
    setSearchResults(filteredJobs);
    setIsSearching(false);
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [jobs]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return debouncedSearch.cancel;
  }, [searchQuery, debouncedSearch]);

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Dream Job</span> Today
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and ambitions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="w-full pl-16 pr-12 py-5 border border-transparent rounded-full focus:ring-4 focus:ring-blue-400 focus:border-transparent bg-white/10 dark:bg-gray-800/50 text-white placeholder-gray-300 dark:placeholder-gray-400 backdrop-blur-sm shadow-2xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <FiX className="h-6 w-6" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="absolute w-full mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-10 max-h-96 overflow-y-auto">
              {isSearching && searchResults.length === 0 && (
                <div className="flex justify-center items-center p-6">
                  <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
                  <p className="ml-4 text-gray-600 dark:text-gray-300">Searching...</p>
                </div>
              )}
              {!isSearching && searchResults.length === 0 && (
                <div className="text-center p-6">
                  <p className="text-gray-800 dark:text-white font-semibold">No jobs found.</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Try a different search term.</p>
                </div>
              )}
              {searchResults.length > 0 && (
                <div>
                  {searchResults.map(job => (
                    <div key={job._id} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer flex items-center space-x-4">
                      <img src={job.company?.avatar?.avatar_Url || "/placeholder.svg"} alt={job.company?.companyInfo?.companyName} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-grow">
                        <Link to={`/jobs/${job?._id}`}>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{job?.title || ""}</h4>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company?.companyInfo?.companyName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {`${job?.salary?.min_salary} - ${job?.salary?.max_salary} ${job?.salary?.currency}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{job?.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;