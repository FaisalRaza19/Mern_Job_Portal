import React from 'react'

const CompanyJob = () => {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
    )
}

export default CompanyJob
