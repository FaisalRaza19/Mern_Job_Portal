import React, { useState, useEffect } from "react"
import ReviewCard from "./ReviewCard.jsx"
import SkeletonReviewCard from "./Skeleton/CompanyReviews.jsx"
import { FaChevronDown } from 'react-icons/fa'

const ReviewList = ({ reviews}) => {
    const [displayCount, setDisplayCount] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("recent") 
    const [sortedReviews, setSortedReviews] = useState([])

    useEffect(() => {
        const tempReviews = [...reviews]
        if (filter === "recent") {
            tempReviews.sort((a, b) => new Date(b.date) - new Date(a.date))
        } else if (filter === "helpful") {
            // Mock helpfulness for demonstration
            tempReviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
        } else if (filter === "rating") {
            tempReviews.sort((a, b) => b.rating - a.rating)
        }
        setSortedReviews(tempReviews)
    }, [reviews, filter])

    const reviewsToShow = sortedReviews.slice(0, displayCount)

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
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Reviews ({reviews.length})</h3>
                <div className="flex space-x-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="helpful">Most Helpful</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </div>
            <div className="grid gap-6">
                {reviewsToShow.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
                {isLoading && (
                    <>
                        <SkeletonReviewCard />
                        <SkeletonReviewCard />
                    </>
                )}
                {reviews.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">No reviews yet. Be the first to leave one!</p>
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-center space-x-4">
                {displayCount < sortedReviews.length && (
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
                            "Show More Reviews"
                        )}
                        <FaChevronDown className="ml-2 h-4 w-4" />
                    </button>
                )}
                {displayCount > 5 && sortedReviews.length > 5 && (
                    <button
                        onClick={handleHide}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                        Hide Reviews
                    </button>
                )}
            </div>
        </div>
    )
}

export default ReviewList
