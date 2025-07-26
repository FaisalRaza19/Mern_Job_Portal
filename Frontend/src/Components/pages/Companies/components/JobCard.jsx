import React, { useContext } from 'react'
import { FaMapPin, FaDollarSign, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Context } from '../../../../Context/context'

const JobCard = ({ job }) => {
    const {userData} = useContext(Context)
    const isApplied = userData?.jobSeekerInfo?.appliedJobs?.some((e)=>e?.jobId && e?.jobId === job?._id)
    return (
        <article className="rounded-xl bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{job?.title || ""}</h3>
            <div className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <div className="flex items-center text-sm">
                    <FaMapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{job?.isRemote === true ? "Remote" : job?.location}</span>
                </div>
                <div className="flex items-center text-sm">
                    <FaDollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{job?.salary?.currency} {job?.salary?.min_salary} - {job?.salary?.max_salary}</span>
                </div>
                <div className="flex items-center text-sm">
                    <FaClock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{job?.experienceLevel}</span>
                </div>
            </div>
            <div className="mt-6">
                <Link to={`/jobs/${job?._id}`}>
                    <button disabled={isApplied} className="inline-flex disabled:cursor-not-allowed w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">
                        {isApplied ? "Applied!"  : "Apply Now"}
                    </button>
                </Link>
            </div >
        </article >
    )
}

export default JobCard
