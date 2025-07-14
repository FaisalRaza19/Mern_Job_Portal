import React from 'react'
// import { IconType } from "react-icons"

const StatsCard = ({ stat })=>{
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
        </div>
        <div className={`p-3 rounded-full ${stat.color}`}>
          <stat.icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
