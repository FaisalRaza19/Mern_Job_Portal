import React from 'react'

const CompanyCard = () => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 ease-in-out">
            <div className="flex items-center space-x-4">
                <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-6 h-10 w-full animate-pulse rounded-md bg-gray-200" />
        </div>
    )
}


export default CompanyCard
