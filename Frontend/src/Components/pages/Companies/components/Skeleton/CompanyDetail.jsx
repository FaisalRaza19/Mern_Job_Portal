import React from 'react'

const CompanyDetail = () => {
    return (
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                <div className="mb-4 h-32 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 md:mb-0" />
                <div className="w-full flex-1 space-y-4 text-center md:text-left">
                    <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="flex items-center justify-center space-x-4 md:justify-start">
                        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                        <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="mb-3 h-8 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
        </section>
    )
}

export default CompanyDetail
