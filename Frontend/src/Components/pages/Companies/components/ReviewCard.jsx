import React, { useState, useContext } from 'react'
import {
    FaStar, FaStarHalfAlt, FaRegStar, FaCalendar, FaEllipsisV
} from 'react-icons/fa'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { Context } from '../../../../Context/context.jsx'

const ReviewCard = ({ review, userId: currentUserId, setReviews }) => {
    const { reviews, showAlert } = useContext(Context)
    const { editReview, delReview } = reviews
    const [isVisible, setIsVisible] = useState(true)
    const { companyId } = useParams()
    const {
        title = '',
        comment = '',
        rating = 0,
        createdAt = '',
        userId = {},
        _id,
    } = review || {}

    const isOwner = review?.userId?._id === currentUserId;
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    const [menuOpen, setMenuOpen] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [editForm, setEditForm] = useState({ title, comment, rating })

    const toggleMenu = () => setMenuOpen(prev => !prev)

    const handleEditSubmit = async () => {
        try {
            const formData = {
                title: editForm.title,
                comment: editForm.comment,
                rating: editForm.rating,
                reviewId: _id,
            };

            const res = await editReview({ companyId, formData });
            showAlert(res)

            if (res.statusCode === 200) {
                setReviews((prev) =>
                    prev.map((r) => (r._id === _id ? { ...r, ...formData } : r))
                );
            }
        } catch (error) {
            console.error("Error editing review:", error);
            showAlert({ type: "error", message: "Failed to update review" });
        } finally {
            setShowEditModal(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await delReview(companyId, _id);
            showAlert(res)
            if (res.statusCode === 200) {
                setReviews(prev => prev.filter(r => r._id !== _id));
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            setShowDeleteConfirm(false);
        }
    };



    const renderStars = () => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars <= 0.75

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-full-${i}`} className="text-yellow-400 h-5 w-5" />)
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="star-half" className="text-yellow-400 h-5 w-5" />)
        }

        const remaining = 5 - stars.length
        for (let i = 0; i < remaining; i++) {
            stars.push(<FaRegStar key={`star-empty-${i}`} className="text-gray-300 dark:text-gray-600 h-5 w-5" />)
        }

        return stars
    }

    return (
        <>
            {isVisible && (
                <article className={`transition-all duration-300 transform ${!isVisible ? 'scale-0 opacity-0' : ''} relative rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 transition-all duration-300 hover:shadow-lg`}>
                    {/* Dropdown menu */}
                    {isOwner && (
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={toggleMenu}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                            >
                                <FaEllipsisV />
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-32 rounded-md bg-white dark:bg-gray-900 shadow-lg z-50">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false)
                                            setShowEditModal(true)
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false)
                                            setShowDeleteConfirm(true)
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Avatar, Name, Date */}
                    <div className="flex items-center mb-4">
                        <img
                            src={userId?.avatar?.avatar_Url || '/placeholder-user.jpg'}
                            className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                        />
                        <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {userId?.jobSeekerInfo?.fullName || 'Anonymous'}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <FaCalendar className="mr-1 h-4 w-4" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center mb-2">
                        {renderStars()}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            ({rating.toFixed(1)})
                        </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h5>

                    {/* Comment */}
                    <p className="text-gray-700 dark:text-gray-300">{comment}</p>
                </article>
            )}

            {/* Edit Modal */}
            {showEditModal &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="rounded-xl bg-white p-6 w-full max-w-md dark:bg-gray-900 shadow-xl">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Review</h3>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full mb-3 rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
                                placeholder="Review title"
                            />
                            <textarea
                                value={editForm.comment}
                                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                rows="4"
                                className="w-full mb-3 rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
                                placeholder="Your review"
                            />
                            <input
                                type="number"
                                min="1"
                                max="5"
                                step="0.5"
                                value={editForm.rating}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, rating: parseFloat(e.target.value) })
                                }
                                className="w-full mb-4 rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="rounded-xl bg-white p-6 w-full max-w-sm dark:bg-gray-900 shadow-xl">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Delete this review?</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    )
}

export default ReviewCard
