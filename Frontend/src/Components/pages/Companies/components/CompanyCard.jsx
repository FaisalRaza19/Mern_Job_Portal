import React, { useEffect, useState } from "react"
import { FaStar, FaMapPin, FaBriefcase } from "react-icons/fa"
import { Link } from "react-router-dom"

const CompanyCard = ({ company, index }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    if (company?.companyInfo?.companyReviews && company?.companyInfo?.companyReviews.length > 0) {
      const totalRating = company?.companyInfo?.companyReviews.reduce((sum, review) => sum + review.rating, 0)
      const avg = (totalRating / company?.companyInfo?.companyReviews.length).toFixed(1)
      setAverageRating(parseFloat(avg))
    } else {
      setAverageRating(0)
    }
  }, [company])

  // Animation effect for cards
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)

    return () => clearTimeout(timer)
  }, [index])

  return (
    <article
      className={`relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-md
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={company?.avatar?.avatar_Url || "/placeholder.svg?height=64&width=64&query=company%20logo"}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
          alt={`${company?.companyInfo?.companyName} logo`}
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{company?.companyInfo?.companyName}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <FaStar className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{averageRating}</span>
            {company?.companyReviews && company.companyReviews.length > 0 && (
              <span className="ml-1">({company.companyReviews.length} reviews)</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-gray-700">
        <div className="flex items-center text-sm">
          <FaMapPin className="mr-2 h-4 w-4 text-gray-500" />
          <span>{company?.companyInfo?.companyLocation || "None"}</span>
        </div>
        <div className="flex items-center text-sm">
          <FaBriefcase className="mr-2 h-4 w-4 text-gray-500" />
          <span>{company?.companyInfo?.companyType || "None"}</span>
        </div>
      </div>
      <div className="mt-6">
        <Link to={`/companies/${company?._id}`}>
          <button
            className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            View Details
          </button>
        </Link>
      </div>
    </article>
  )
}

export default CompanyCard