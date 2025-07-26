import React from 'react'
import { FaStar, FaUser, FaCalendar } from 'react-icons/fa'

const ReviewCard = ({ review }) => {
    return (
        <article className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`h-5 w-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                                }`}
                        />
                    ))}
                </div>
                <h4 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-50">{review.headline}</h4>
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{review.message}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                    <FaUser className="mr-1 h-4 w-4" />
                    <span>{review.author}</span>
                </div>
                <div className="flex items-center">
                    <FaCalendar className="mr-1 h-4 w-4" />
                    <span>{review.date}</span>
                </div>
            </div>
        </article>
    )
}

export default ReviewCard
