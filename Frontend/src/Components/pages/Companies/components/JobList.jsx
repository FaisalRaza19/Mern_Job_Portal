import React, { useState, useEffect } from "react"
import JobCard from "./JobCard.jsx"
import SkeletonJobCard from "./Skeleton/CompanyJob.jsx"
import JobFilter from "./JobFilter.jsx"
import { FaChevronDown } from 'react-icons/fa'

const JobList = ({ jobs }) => {
  const [displayCount, setDisplayCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState([])

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    location: "",
    salary: "",
    remoteOnly: false,
  })

  useEffect(() => {
    applyFilters()
  }, [jobs, filters])

  const isAnyFilterActive = Object.values(filters).some((val) =>
    typeof val === "string" ? val.trim() !== "" : val === true
  )

  const applyFilters = () => {
    let tempJobs = jobs?.filter((job) => job?.status === "Active")

    const { search, role, location, salary, remoteOnly } = filters

    if (search) {
      tempJobs = tempJobs?.filter((job) =>
        job.title?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (role) {
      tempJobs = tempJobs?.filter((job) =>
        job.title?.toLowerCase().includes(role.toLowerCase())
      )
    }

    if (location) {
      tempJobs = tempJobs?.filter((job) =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (remoteOnly) {
      tempJobs = tempJobs?.filter((job) => job.isRemote === true)
    }

    if (salary) {
      const [min, max] = salary.replace(/\$/g, "").replace(/k/g, "000").split(" - ").map(Number)
      tempJobs = tempJobs?.filter((job) => {
        const minSalary = parseInt(job.salary?.min_salary || 0)
        const maxSalary = parseInt(job.salary?.max_salary || 0)
        return minSalary >= min && maxSalary <= max
      })
    }

    setFilteredJobs(tempJobs)
    setDisplayCount(5)
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      role: "",
      location: "",
      salary: "",
      remoteOnly: false,
    })
  }

  const jobsToShow = filteredJobs.slice(0, displayCount)

  const handleShowMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5)
      setIsLoading(false)
    }, 500)
  }

  const handleHide = () => setDisplayCount(5)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Active Jobs ({filteredJobs.length})
        </h3>
        {isAnyFilterActive && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-400"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <JobFilter filters={filters} onChange={handleFilterChange} />

      <div className="grid gap-6 mt-6">
        {jobsToShow.map((job) => (
          <JobCard key={job?._id} job={job} />
        ))}
        {isLoading && (
          <>
            <SkeletonJobCard />
            <SkeletonJobCard />
          </>
        )}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p className="text-lg">No jobs found matching your filters.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        {displayCount < filteredJobs.length && (
          <button
            onClick={handleShowMore}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white dark:border-gray-900" />
                Loading...
              </>
            ) : (
              <>
                Show More Jobs <FaChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        )}
        {displayCount > 5 && filteredJobs.length > 5 && (
          <button
            onClick={handleHide}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            Hide Jobs
          </button>
        )}
      </div>
    </div>
  )
}

export default JobList
