import React from 'react'
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiBookmark, FiExternalLink } from "react-icons/fi"
import {featuredJobs} from "../../../../temp/data.js"

const FeaturedJobs = ()=>{
  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Jobs</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover hand-picked opportunities from top companies looking for talented professionals like you
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${job.featured ? "border-blue-200 dark:border-blue-700" : "border-gray-200 dark:border-gray-700"
                } overflow-hidden`}
            >
              {job.featured && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 absolute top-4 right-4 rounded-full">
                  Featured
                </div>
              )}

              <div className="p-6">
                {/* Company Logo and Basic Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={job.logo || "/placeholder.svg"}
                      alt={`${job.company} logo`}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{job.company}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <FiMapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <FiBriefcase className="h-4 w-4 mr-2" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <FiDollarSign className="h-4 w-4 mr-2" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <FiClock className="h-4 w-4 mr-2" />
                    {job.posted}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{job.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Apply Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <span>Apply Now</span>
                  <FiExternalLink className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center">
          <button className="bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedJobs
