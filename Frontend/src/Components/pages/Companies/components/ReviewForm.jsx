import React, { useState } from "react"
import { FaStar } from "react-icons/fa"

const ReviewForm = ({ onSubmit,user}) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [headline, setHeadline] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!rating || !headline.trim() || !message.trim()) {
            alert("Please fill in all fields and provide a rating.")
            return
        }

        onSubmit({ rating: parseFloat(rating), headline, message })
        setRating(0)
        setHeadline("")
        setMessage("")
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Star Rating</label>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => {
                            const value = i + 1;
                            return (
                                <FaStar
                                    key={i}
                                    className={`h-8 w-8 cursor-pointer transition-colors ${(hoverRating || rating) >= value ? "text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHoverRating(value)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            )
                        })}
                    </div>
                </div>
                <div>
                    <label htmlFor="headline" className="block text-sm font-medium text-gray-700 ">Headline</label>
                    <input
                        type="text"
                        id="headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Summarize your experience"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 ">Your Review</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Share your detailed experience..."
                        required
                    />
                </div>
                <button disabled={user?.role === "employer"} type="submit"
                    className="w-full disabled:cursor-not-allowed disabled:bg-gray-500 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Submit Review
                </button>
            </form>
        </div>
    )
}

export default ReviewForm
