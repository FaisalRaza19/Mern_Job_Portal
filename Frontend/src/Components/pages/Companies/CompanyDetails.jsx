import React, { useState, useEffect, useContext } from 'react'
import JobList from "./components/JobList.jsx"
import ReviewForm from "./components/ReviewForm.jsx"
import ReviewList from "./components/ReviewList.jsx"
import SkeletonCompanyDetails from "./components/Skeleton/CompanyDetail.jsx"
import { FaMapPin, FaBriefcase, FaGlobe, FaUsers, FaArrowLeft } from 'react-icons/fa'
import { FiAlertCircle, FiMail } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { Context } from '../../../Context/context.jsx'

const CompanyDetails = () => {
    const { companyId } = useParams();
    const { Jobs, reviews, userData, showAlert } = useContext(Context);
    const { companyAlljobs } = Jobs
    const { getAllReviews } = reviews
    const [CompanyDetails, setCompanyDetails] = useState("")
    const [companyJobs, setCompanyJobs] = useState([]);
    const [allReviews, setAllReviews] = useState([])
    const [loading, setLoading] = useState(true)

    // get company details and jobs
    const companyDetails = async () => {
        try {
            setLoading(true)
            const data = await companyAlljobs(companyId);
            const res = await getAllReviews(companyId);
            setTimeout(() => {
                if (data.statusCode === 200) {
                    setCompanyDetails(data?.data?.[0].company)
                    setCompanyJobs(data?.data)
                    if (res.statusCode === 200) {
                        setAllReviews(res?.data?.companyInfo?.companyReviews)
                    }
                } else {
                    setCompany(null)
                    setJobs([])
                }
            }, 800)
        } catch (error) {
            console.log("error during get compnay detaisl", error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        companyDetails();
    }, [companyId])

    // already saved by you, just modify handleReviewSubmit
    const handleReviewSubmit = async (newReview) => {
        try {
            const formData = {
                title: newReview.headline,
                rating: newReview.rating,
                comment: newReview.message,
            }
            const data = await reviews.addReview({ companyId, formData });
            showAlert(data);

            if (data.statusCode === 200) {
                const manualReview = {
                    _id: Date.now().toString(),
                    title: formData.title,
                    comment: formData.comment,
                    rating: formData.rating,
                    createdAt: new Date().toISOString(),
                    userId: {
                        _id: userData?._id,
                        jobSeekerInfo: {
                            fullName: userData?.jobSeekerInfo?.fullName || "You",
                        },
                        avatar: userData?.avatar || { avatar_Url: "" },
                    },
                };

                setAllReviews((prev) => [manualReview, ...prev]);
            }
        } catch (err) {
            console.error("Failed to submit review", err);
            alert("Something went wrong. Try again.");
        }
    }



    if (loading) {
        return (
            <main className="min-h-screen p-4 md:p-8">
                <Link to="/companies">
                    <button
                        className="mb-6 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </button>
                </Link>
                <div className="mx-auto max-w-6xl space-y-8">
                    <SkeletonCompanyDetails />
                    {/* Job List Skeleton (JobList component handles its own) */}
                    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="mb-4 h-8 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-6 h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="grid gap-6">
                            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                                <div className="space-y-3">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                                <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                                <div className="space-y-3">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                                <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                    {/* Review Section Skeleton (ReviewForm and ReviewList components handle their own) */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="mb-4 h-8 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-4">
                                <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-20 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="mb-4 h-8 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="grid gap-6">
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                        <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                        <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (!companyDetails) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <FiAlertCircle className="mb-4 h-16 w-16 text-gray-500 dark:text-gray-400" />
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">Company not found.</p>
                <Link to="/companies">
                    <button
                        className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </button>
                </Link>
            </main>
        )
    }

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <Link to="/companies">
                    <button
                        className="mb-6 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </button>
                </Link>
                {/* Company Overview */}
                <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                        <img
                            src={CompanyDetails?.avatar?.avatar_Url || "/placeholder.svg?height=128&width=128&query=company%20logo"}
                            width={128}
                            height={128}
                            className="mb-4 h-32 w-32 rounded-full object-cover"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">{CompanyDetails?.companyInfo?.companyName || ""}</h1>
                            <div className="mt-2 flex items-center justify-center space-x-4 text-gray-700 dark:text-gray-300 md:justify-start">
                                <span className="flex items-center text-lg">
                                    <FaBriefcase className="mr-2 h-5 w-5" />
                                    {CompanyDetails?.companyInfo?.companyType || ""}
                                </span>
                                <span className="flex items-center text-lg">
                                    <FaMapPin className="mr-2 h-5 w-5" />
                                    {CompanyDetails?.companyInfo?.companyLocation.split(",")[0]}
                                </span>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-2 text-gray-700 dark:text-gray-300 md:grid-cols-2 md:gap-4">
                                <div className="flex items-center">
                                    <FaUsers className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span>{CompanyDetails?.companyInfo?.companySize || 0}</span>
                                </div>
                                <a
                                    href={CompanyDetails?.companyInfo?.companyWeb || "/"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    <FaGlobe className="mr-2 h-5 w-5" />
                                    {CompanyDetails?.companyInfo?.companyWeb.replace(/(^\w+:|^)\/\//, "")}
                                </a>
                                <a
                                    href={`mailto:${CompanyDetails?.email}`}
                                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    <FiMail className="mr-2 h-5 w-5" />
                                    {CompanyDetails?.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-50">About Us</h2>
                        <p className="text-gray-700 dark:text-gray-300">{CompanyDetails?.companyInfo?.companyDescription}</p>
                    </div>
                </section>

                {/* Job List Section */}
                <section>
                    <JobList jobs={companyJobs} />
                </section>

                {/* Review Section */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <ReviewForm onSubmit={handleReviewSubmit} />
                    <ReviewList reviews={allReviews} userId={userData?._id} setReviews={setAllReviews} />
                </section>
            </div>
        </main>
    )
}

export default CompanyDetails
