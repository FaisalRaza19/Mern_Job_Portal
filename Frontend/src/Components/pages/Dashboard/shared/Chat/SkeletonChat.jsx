import React from 'react'

const SkeletonChat = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header Skeleton */}
            <div className="p-4 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Chat List Skeleton */}
            <div className="flex-1 overflow-y-auto">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 border-b border-gray-100">
                        {/* Avatar Skeleton */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>

                        {/* Content Skeleton */}
                        <div className="flex-1 ml-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default SkeletonChat
