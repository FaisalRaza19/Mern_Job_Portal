import React, { useEffect, useState } from "react"
import { industryOptions } from "../../../../temp/data.js"

const CompanyFilter = ({ onFilter }) => {
  const [location, setLocation] = useState("")
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Trigger filtering on change
  useEffect(() => {
    onFilter({ location, industry, size })
  }, [location, industry, size])

  const handleClear = () => {
    setLocation("")
    setIndustry("")
    setSize("")
    onFilter({ location: "", industry: "", size: "" })
  }

  const isAnyFilterApplied = location || industry || size

  return (
    <div className={`transition-all duration-500 ease-out ${isVisible ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0"}`}>
      <div className="flex flex-wrap gap-4 items-center">
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50">
          <option value="">All Locations</option>
          <option value="New York">New York</option>
          <option value="London">London</option>
          <option value="Dubai">Dubai</option>
          <option value="San Francisco">San Francisco</option>
        </select>

        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50">
          <option value="">All Industries</option>
          {industryOptions.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>

        <select value={size} onChange={(e) => setSize(e.target.value)} className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50">
          <option value="">All Sizes</option>
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
          <option value="51-200">51-200</option>
          <option value="201-500">201-500</option>
          <option value="501-1000">501-1000</option>
          <option value="1001-5000">1001-5000</option>
          <option value="5001-10000">5001-10000</option>
          <option value="10000+">10000+</option>
        </select>

        {isAnyFilterApplied && (
          <button
            onClick={handleClear}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}

export default CompanyFilter
