import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiLoader, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

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
    const filteredJobs = jobs.filter((job) => {
      const companyName = job.company?.companyInfo?.companyName || "";
      return (
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        companyName.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
      );
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
    <section className="relative bg-gray-50 overflow-hidden">
      {/* subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 opacity-70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Text Section */}
        <div className="text-center mb-12">
          <h1 className="text-[42px] font-extrabold text-gray-900 leading-tight mb-4">
            Find Your <span className="text-blue-600">Dream Job</span> Today
          </h1>
          <p className="text-[14px] text-gray-600 max-w-2xl mx-auto mb-3">
            Discover thousands of opportunities across industries and companies.
            Whether you’re just starting your career or looking to take the next step,
            we’ll help you connect with the right employers.
          </p>
          <p className="text-[14px] text-gray-500 max-w-xl mx-auto">
            Search by job title, company, or location and land the role that matches
            your skills, passion, and ambition.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto relative">
          <div className="relative bg-white rounded-full shadow-md overflow-hidden">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jobs, companies, or locations..."
              className="w-full pl-14 pr-10 py-4 border-none focus:ring-2 focus:ring-blue-400 rounded-full text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="absolute w-full mt-3 bg-white rounded-xl shadow-lg p-3 z-10 max-h-80 overflow-y-auto">
              {isSearching && searchResults.length === 0 && (
                <div className="flex justify-center items-center p-5">
                  <FiLoader className="animate-spin h-6 w-6 text-blue-500" />
                  <p className="ml-3 text-gray-600">Searching...</p>
                </div>
              )}
              {!isSearching && searchResults.length === 0 && (
                <div className="text-center p-5">
                  <p className="text-gray-800 font-semibold">No jobs found.</p>
                  <p className="text-gray-500 text-sm">
                    Try a different search term.
                  </p>
                </div>
              )}
              {searchResults.length > 0 && (
                <div>
                  {searchResults.map((job) => (
                    <div
                      key={job._id}
                      className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center space-x-4 transition"
                    >
                      <img
                        src={
                          job.company?.avatar?.avatar_Url || "/placeholder.svg"
                        }
                        alt={job.company?.companyInfo?.companyName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-grow">
                        <Link to={`/jobs/${job?._id}`}>
                          <h4 className="font-semibold text-gray-900 text-[14px]">
                            {job?.title || ""}
                          </h4>
                        </Link>
                        <p className="text-xs text-gray-600">
                          {job.company?.companyInfo?.companyName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-blue-600">
                          {`${job?.salary?.min_salary} - ${job?.salary?.max_salary} ${job?.salary?.currency}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {job?.location}
                        </p>
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
