import React from 'react'

const SkeletonMessage = ({ isOwn })=>{
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar Skeleton */}
        {!isOwn && <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>}

        {/* Message Bubble Skeleton */}
        <div className={`${isOwn ? "mr-2" : "ml-2"}`}>
          <div className={`px-4 py-2 rounded-2xl animate-pulse ${isOwn ? "bg-gray-200" : "bg-gray-100"}`}>
            <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>

          {/* Timestamp Skeleton */}
          <div className={`flex items-center mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonMessage
