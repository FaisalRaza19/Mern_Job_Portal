import React, { useState, useEffect } from "react"
import ReviewCard from "./ReviewCard.jsx"
import SkeletonReviewCard from "./Skeleton/CompanyReviews.jsx"
import { FaChevronDown } from 'react-icons/fa'

const ReviewList = ({ reviews, userId, setReviews }) => {
    const [displayCount, setDisplayCount] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("recent")
    const [sortedReviews, setSortedReviews] = useState([])

    useEffect(() => {
        if (!Array.isArray(reviews)) return;
        let tempReviews = [...reviews];

        if (filter === "recent") {
            tempReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filter === "rating") {
            tempReviews.sort((a, b) => b.rating - a.rating);
        }

        setSortedReviews(tempReviews);
    }, [reviews, filter]);

    const reviewsToShow = sortedReviews.slice(0, displayCount)

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
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    Reviews ({reviews?.length || 0})
                </h3>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                >
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>

            <div className="grid gap-6">
                {reviewsToShow.map((review) => (
                    <ReviewCard key={review._id} review={review} userId={userId} setReviews={setReviews}
                        reviews={reviews} />
                ))}

                {isLoading && (
                    <>
                        <SkeletonReviewCard />
                        <SkeletonReviewCard />
                    </>
                )}

                {reviews?.length === 0 && !isLoading && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        No reviews yet. Be the first to leave one!
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-center space-x-4">
                {displayCount < sortedReviews.length && (
                    <button
                        onClick={handleShowMore}
                        disabled={isLoading}
                        className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-50 dark:text-gray-900"
                    >
                        {isLoading ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white dark:border-gray-900" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Show More Reviews
                                <FaChevronDown className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                )}
                {displayCount > 5 && sortedReviews.length > 5 && (
                    <button
                        onClick={handleHide}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                        Hide Reviews
                    </button>
                )}
            </div>
        </div>
    )
}

export default ReviewList
