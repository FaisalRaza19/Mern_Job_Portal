import React, { useState, useEffect } from 'react'
import JobList from "./components/JobList.jsx"
import ReviewForm from "./components/ReviewForm.jsx"
import ReviewList from "./components/ReviewList.jsx"
import SkeletonCompanyDetails from "./components/Skeleton/CompanyDetail.jsx"
import { FaMapPin, FaBriefcase, FaGlobe, FaUsers, FaPhone, FaArrowLeft } from 'react-icons/fa'
import { FiAlertCircle, FiMail } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'

// Mock Data for all companies (imported to find the specific company)
const allCompaniesData = [
    {
        id: "1",
        name: "Tech Solutions Inc.",
        logo: "/placeholder.svg?height=128&width=128",
        location: "123 Tech Street, New York, NY 10001, USA",
        industry: "Software Development, IT Services",
        rating: 4.5,
        size: "500-1000 employees",
        website: "https://www.techsolutions.com",
        email: "info@techsolutions.com",
        phone: "+1 (212) 555-0100",
        description:
            "Tech Solutions Inc. is a leading innovator in software development and IT services, dedicated to creating cutting-edge solutions for businesses worldwide. With a focus on cloud computing, AI, and cybersecurity, we empower our clients to achieve digital transformation and stay ahead in a rapidly evolving technological landscape. Our team of passionate experts thrives on collaboration and continuous learning, fostering an environment where creativity and problem-solving flourish. We are committed to delivering excellence and driving impactful change through technology.",
    },
    {
        id: "2",
        name: "Global Finance Group",
        logo: "/placeholder.svg?height=128&width=128",
        location: "45 Wall Street, London, UK",
        industry: "Finance",
        rating: 4.2,
        size: "1000+ employees",
        website: "https://www.globalfinance.com",
        email: "contact@globalfinance.com",
        phone: "+44 20 7123 4567",
        description:
            "Global Finance Group is a premier financial services firm offering a wide range of solutions from investment banking to asset management. We pride ourselves on our global reach and deep market insights, helping clients navigate complex financial landscapes. Our commitment to integrity and client success drives everything we do.",
    },
    {
        id: "3",
        name: "Health Innovations",
        logo: "/placeholder.svg?height=128&width=128",
        location: "789 Medical Ave, San Francisco, CA 94105, USA",
        industry: "Healthcare",
        rating: 4.8,
        size: "51-200 employees",
        website: "https://www.healthinnovations.org",
        email: "info@healthinnovations.org",
        phone: "+1 (415) 987-6543",
        description:
            "Health Innovations is at the forefront of medical technology and patient care. We develop groundbreaking solutions that improve health outcomes and enhance the quality of life. Our collaborative environment fosters innovation and a deep commitment to making a difference in the healthcare sector.",
    },
    // Add more company data here if needed for dynamic testing
]

// Mock Data for jobs related to any company (will be filtered by companyId)
const allMockJobs = [
    {
        id: "job1",
        companyId: "1",
        title: "Senior Software Engineer (Frontend)",
        location: "New York, NY (Hybrid)",
        salary: "$120,000 - $150,000",
        experience: "5+ years",
        status: "Active",
    },
    {
        id: "job2",
        companyId: "1",
        title: "Cloud Solutions Architect",
        location: "Remote",
        salary: "$130,000 - $160,000",
        experience: "7+ years",
        status: "Active",
    },
    {
        id: "job3",
        companyId: "1",
        title: "Product Manager (AI/ML)",
        location: "New York, NY",
        salary: "$110,000 - $140,000",
        experience: "4+ years",
        status: "Active",
    },
    {
        id: "job4",
        companyId: "1",
        title: "DevOps Engineer",
        location: "New York, NY (Hybrid)",
        salary: "$100,000 - $130,000",
        experience: "3+ years",
        status: "Active",
    },
    {
        id: "job5",
        companyId: "1",
        title: "Cybersecurity Analyst",
        location: "New York, NY",
        salary: "$90,000 - $120,000",
        experience: "2+ years",
        status: "Active",
    },
    {
        id: "job6",
        companyId: "1",
        title: "Junior Software Developer",
        location: "New York, NY",
        salary: "$70,000 - $90,000",
        experience: "0-2 years",
        status: "Active",
    },
    {
        id: "job7",
        companyId: "1",
        title: "HR Business Partner",
        location: "New York, NY",
        salary: "$80,000 - $100,000",
        experience: "3+ years",
        status: "Inactive", // This job should not be shown initially
    },
    {
        id: "job8",
        companyId: "2",
        title: "Financial Analyst",
        location: "London, UK",
        salary: "£50,000 - £70,000",
        experience: "2+ years",
        status: "Active",
    },
    {
        id: "job9",
        companyId: "2",
        title: "Investment Banker",
        location: "London, UK",
        salary: "£80,000 - £120,000",
        experience: "5+ years",
        status: "Active",
    },
    {
        id: "job10",
        companyId: "3",
        title: "Biomedical Engineer",
        location: "San Francisco, CA",
        salary: "$90,000 - $110,000",
        experience: "3+ years",
        status: "Active",
    },
]

// Mock Data for reviews related to any company (will be filtered by companyId)
const allMockReviews = [
    {
        id: "rev1",
        companyId: "1",
        rating: 5,
        headline: "Great place to grow!",
        message:
            "Tech Solutions Inc. offers an amazing environment for professional growth. The leadership is supportive, and the projects are challenging and innovative. Highly recommend for anyone looking to make a real impact.",
        author: "Jane Doe",
        date: "2023-10-26",
    },
    {
        id: "rev2",
        companyId: "1",
        rating: 4,
        headline: "Good work-life balance",
        message:
            "The company truly values work-life balance, which is rare in the tech industry. Compensation is competitive, and the benefits package is comprehensive. Some processes could be more streamlined, but overall a positive experience.",
        author: "John Smith",
        date: "2023-09-15",
    },
    {
        id: "rev3",
        companyId: "1",
        rating: 5,
        headline: "Innovative and collaborative",
        message:
            "Working at Tech Solutions Inc. has been a fantastic experience. The teams are highly collaborative, and there is a strong emphasis on innovation. Always learning something new here!",
        author: "Alice Johnson",
        date: "2023-08-01",
    },
    {
        id: "rev4",
        companyId: "2",
        rating: 4,
        headline: "Solid financial firm",
        message: "Professional environment with good opportunities in finance. Fast-paced but rewarding.",
        author: "Michael Brown",
        date: "2023-11-01",
    },
    {
        id: "rev5",
        companyId: "3",
        rating: 5,
        headline: "Pioneering healthcare solutions",
        message: "Exciting work in a field that truly matters. The team is brilliant and dedicated.",
        author: "Sarah Green",
        date: "2023-12-05",
    },
]

const CompanyDetails = () => {
    const {companyId} = useParams();

    const [company, setCompany] = useState(null)
    const [jobs, setJobs] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const foundCompany = allCompaniesData.find((c) => c.id === companyId)
            if (foundCompany) {
                setCompany(foundCompany)
                setJobs(allMockJobs.filter((job) => job.companyId === companyId))
                setReviews(allMockReviews.filter((review) => review.companyId === companyId))
            } else {
                setCompany(null)
                setJobs([])
                setReviews([])
            }
            setLoading(false)
        }, 800)
    }, [companyId])

    const handleReviewSubmit = (newReview) => {
        console.log("New review submitted:", newReview)
        // In a real app, you'd send this to an API and update state/re-fetch reviews
        const newId = `rev${allMockReviews.length + 1}` // Simple mock ID
        const reviewWithCompanyId = { ...newReview, id: newId, companyId: companyId }
        setReviews((prevReviews) => [reviewWithCompanyId, ...prevReviews]) // Add new review to the top
        alert("Review submitted! (Mock)")
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

    if (!company) {
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
                            src={company.logo || "/placeholder.svg?height=128&width=128&query=company%20logo"}
                            alt={`${company.name} logo`}
                            width={128}
                            height={128}
                            className="mb-4 h-32 w-32 rounded-full object-cover"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">{company.name}</h1>
                            <div className="mt-2 flex items-center justify-center space-x-4 text-gray-700 dark:text-gray-300 md:justify-start">
                                <span className="flex items-center text-lg">
                                    <FaBriefcase className="mr-2 h-5 w-5" />
                                    {company.industry}
                                </span>
                                <span className="flex items-center text-lg">
                                    <FaMapPin className="mr-2 h-5 w-5" />
                                    {company.location.split(",")[0]}
                                </span>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-2 text-gray-700 dark:text-gray-300 md:grid-cols-2 md:gap-4">
                                <div className="flex items-center">
                                    <FaUsers className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span>{company.size}</span>
                                </div>
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    <FaGlobe className="mr-2 h-5 w-5" />
                                    {company.website.replace(/(^\w+:|^)\/\//, "")}
                                </a>
                                <a
                                    href={`mailto:${company.email}`}
                                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    <FiMail className="mr-2 h-5 w-5" />
                                    {company.email}
                                </a>
                                <a
                                    href={`tel:${company.phone}`}
                                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    <FaPhone className="mr-2 h-5 w-5" />
                                    {company.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-50">About Us</h2>
                        <p className="text-gray-700 dark:text-gray-300">{company.description}</p>
                    </div>
                </section>

                {/* Job List Section */}
                <section>
                    <JobList jobs={jobs} />
                </section>

                {/* Review Section */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <ReviewForm onSubmit={handleReviewSubmit} />
                    <ReviewList reviews={reviews} />
                </section>
            </div>
        </main>
    )
}

export default CompanyDetails
