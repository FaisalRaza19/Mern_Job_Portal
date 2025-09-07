import React from 'react'

const CompanyReviews = () => {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-4 flex justify-between text-sm">
                <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/5 animate-pulse rounded bg-gray-200" />
            </div>
        </div>
    )
}

export default CompanyReviews
