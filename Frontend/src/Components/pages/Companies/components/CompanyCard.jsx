import React, { useEffect, useState } from "react"
import { FaStar, FaMapPin, FaBriefcase } from "react-icons/fa"
import { Link } from "react-router-dom"

const CompanyCard = ({ company, index}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)

    return () => clearTimeout(timer)
  }, [index])

  return (
    <article
      className={`relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={company?.avatar?.avatar_Url || "/placeholder.svg?height=64&width=64&query=company%20logo"}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{company?.companyInfo?.companyName}</h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FaStar className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{0}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
        <div className="flex items-center text-sm">
          <FaMapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span>{company?.companyInfo?.companyLocation}</span>
        </div>
        <div className="flex items-center text-sm">
          <FaBriefcase className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span>{company?.companyInfo?.companyType}</span>
        </div>
      </div>
      <div className="mt-6">
        <Link to={`/companies/${company?._id}`}>
          <button
            className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            View Details
          </button>
        </Link>
      </div>
    </article>
  )
}

export default CompanyCard