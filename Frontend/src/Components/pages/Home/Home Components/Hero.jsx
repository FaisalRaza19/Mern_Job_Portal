import React from "react"
import { useState } from "react"
import { FiSearch, FiMapPin, FiBriefcase } from "react-icons/fi"
import {jobCategories,popularSearches} from "../../../../temp/data.js"

const Hero = ()=>{
  const [searchData, setSearchData] = useState({
    keyword: "",
    location: "",
    category: "",
  })

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Search data:", searchData)
    // Handle search logic here
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Dream Job
            </span>
            <br />
            Today
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and ambitions
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">50K+</div>
              <div className="text-blue-200 text-sm">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">10K+</div>
              <div className="text-blue-200 text-sm">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">1M+</div>
              <div className="text-blue-200 text-sm">Job Seekers</div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Job Title/Keywords */}
              <div className="relative">
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title or Keywords
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="keyword"
                    name="keyword"
                    value={searchData.keyword}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="relative">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={searchData.location}
                    onChange={handleChange}
                    placeholder="City, State or Remote"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="relative">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="category"
                    name="category"
                    value={searchData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                  >
                    {jobCategories.map((category) => (
                      <option key={category} value={category === "All Categories" ? "" : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
              <span className="flex items-center justify-center">
                <FiSearch className="mr-2 h-5 w-5" />
                Search Jobs
              </span>
            </button>
          </form>

          {/* Popular Searches */}
          <div className="mt-8 text-center">
            <p className="text-blue-200 mb-4">Popular Searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 hidden lg:block">
        <div className="w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-20 right-10 hidden lg:block">
        <div className="w-16 h-16 bg-purple-400/20 rounded-full animate-bounce"></div>
      </div>
    </section>
  )
}

export default Hero
