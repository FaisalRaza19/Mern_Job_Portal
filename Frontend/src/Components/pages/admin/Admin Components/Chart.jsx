import React from 'react'

const Chart = ({ chartData })=>{
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Posts Trend</h3>
      <div className="flex items-end space-x-2 h-40">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(item.jobs / 320) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chart
