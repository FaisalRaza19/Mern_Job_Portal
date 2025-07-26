import React, { useState } from "react"
import { FaStar } from "react-icons/fa"

const ReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [headline, setHeadline] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (rating === 0 || !headline || !message) {
            alert("Please fill in all fields and provide a rating.")
            return
        }
        onSubmit({ rating, headline, message, author: "Anonymous", date: new Date().toISOString().split("T")[0] })
        setRating(0)
        setHeadline("")
        setMessage("")
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-50">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Star Rating</label>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`h-8 w-8 cursor-pointer transition-colors ${(hoverRating || rating) > i ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                                    }`}
                                onClick={() => setRating(i + 1)}
                                onMouseEnter={() => setHoverRating(i + 1)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="headline" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Headline
                    </label>
                    <input
                        type="text"
                        id="headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                        placeholder="Summarize your experience"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Review
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                        placeholder="Share your detailed experience..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                    Submit Review
                </button>
            </form>
        </div>
    )
}

export default ReviewForm
