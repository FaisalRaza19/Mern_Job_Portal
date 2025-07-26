import React,{ useState, useEffect } from "react"
import JobCard from "./JobCard.jsx"
import SkeletonJobCard from "./Skeleton/CompanyJob.jsx"
import JobFilter from "./JobFilter.jsx"
import { FaChevronDown } from 'react-icons/fa'

const JobList = ({ jobs: initialJobs })=>{
  const [displayCount, setDisplayCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState([])

  useEffect(() => {
    // Initial filter to only show active jobs
    handleFilter({ role: "", location: "", salary: "" })
  }, [initialJobs]) // Re-filter if initialJobs change

  const handleFilter = ({ role, location, salary }) => {
    let tempJobs = initialJobs.filter((job) => job.status === "Active")

    if (role) {
      tempJobs = tempJobs.filter((job) => job.title.toLowerCase().includes(role.toLowerCase()))
    }
    if (location) {
      tempJobs = tempJobs.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }
    if (salary) {
      tempJobs = tempJobs.filter((job) => job.salary.includes(salary))
    }
    setFilteredJobs(tempJobs)
    setDisplayCount(5) // Reset display count on filter change
  }

  const jobsToShow = filteredJobs.slice(0, displayCount)

  const handleShowMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5)
      setIsLoading(false)
    }, 500) // Simulate loading
  }

  const handleHide = () => {
    setDisplayCount(5)
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-50">Active Jobs ({filteredJobs.length})</h3>
      <JobFilter onFilter={handleFilter} />
      <div className="grid gap-6">
        {jobsToShow.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {isLoading && (
          <>
            <SkeletonJobCard />
            <SkeletonJobCard />
          </>
        )}
        {filteredJobs.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        {displayCount < filteredJobs.length && (
          <button
            onClick={handleShowMore}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white dark:border-gray-900" />
                Loading...
              </span>
            ) : (
              "Show More Jobs"
            )}
            <FaChevronDown className="ml-2 h-4 w-4" />
          </button>
        )}
        {displayCount > 5 && filteredJobs.length > 5 && (
          <button
            onClick={handleHide}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            Hide Jobs
          </button>
        )}
      </div>
    </div>
  )
}

export default JobList
