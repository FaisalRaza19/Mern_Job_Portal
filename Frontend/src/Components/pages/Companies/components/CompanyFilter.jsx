import React, { useState, useEffect } from "react"
import { FaFilter, FaChevronDown } from "react-icons/fa"

const CompanyFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleApplyFilters = () => {
    onFilter({ location, industry, size })
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setLocation("")
    setIndustry("")
    setSize("")
    onFilter({ location: "", industry: "", size: "" })
    setIsOpen(false)
  }

  return (
    <div
      className={`relative transition-all duration-500 ease-out md:w-auto ${isVisible ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0"
        }`}
    >
      {/* Mobile/Tablet Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800 md:hidden"
      >
        <FaFilter className="mr-2 h-5 w-5" />
        Filter
        <FaChevronDown className={`ml-2 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Desktop Filters */}
      <div className="hidden md:flex md:space-x-4">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
        >
          <option value="">All Locations</option>
          <option value="New York">New York</option>
          <option value="San Francisco">San Francisco</option>
          <option value="London">London</option>
          <option value="Berlin">Berlin</option>
          <option value="Seattle">Seattle</option>
          <option value="Sydney">Sydney</option>
          <option value="Toronto">Toronto</option>
          <option value="Dubai">Dubai</option>
          <option value="Paris">Paris</option>
          <option value="Tel Aviv">Tel Aviv</option>
          <option value="Boston">Boston</option>
          <option value="Austin">Austin</option>
          <option value="Detroit">Detroit</option>
          <option value="Chicago">Chicago</option>
          <option value="Houston">Houston</option>
        </select>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
        >
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Design">Design</option>
          <option value="Energy">Energy</option>
          <option value="Education">Education</option>
          <option value="Logistics">Logistics</option>
          <option value="Fashion">Fashion</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Marketing">Marketing</option>
          <option value="Automotive">Automotive</option>
          <option value="Food & Beverage">Food & Beverage</option>
          <option value="Construction">Construction</option>
        </select>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
        >
          <option value="">All Sizes</option>
          <option value="1-50">1-50</option>
          <option value="51-200">51-200</option>
          <option value="201-1000">201-1000</option>
          <option value="1000+">1000+</option>
        </select>
        <button
          onClick={handleApplyFilters}
          className="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Apply
        </button>
        <button
          onClick={handleClearFilters}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* Mobile/Tablet Dropdown Content */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-2 rounded-md border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:hidden">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="mobile-location"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <select
                id="mobile-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              >
                <option value="">All Locations</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
                <option value="Berlin">Berlin</option>
                <option value="Seattle">Seattle</option>
                <option value="Sydney">Sydney</option>
                <option value="Toronto">Toronto</option>
                <option value="Dubai">Dubai</option>
                <option value="Paris">Paris</option>
                <option value="Tel Aviv">Tel Aviv</option>
                <option value="Boston">Boston</option>
                <option value="Austin">Austin</option>
                <option value="Detroit">Detroit</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="mobile-industry"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Industry
              </label>
              <select
                id="mobile-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Design">Design</option>
                <option value="Energy">Energy</option>
                <option value="Education">Education</option>
                <option value="Logistics">Logistics</option>
                <option value="Fashion">Fashion</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Marketing">Marketing</option>
                <option value="Automotive">Automotive</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Construction">Construction</option>
              </select>
            </div>
            <div>
              <label htmlFor="mobile-size" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Size
              </label>
              <select
                id="mobile-size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
              >
                <option value="">All Sizes</option>
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClearFilters}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
              >
                Clear
              </button>
              <button
                onClick={handleApplyFilters}
                className="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyFilter
