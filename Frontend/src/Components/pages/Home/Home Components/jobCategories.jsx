import React from 'react'
import {categories} from "../../../../temp/data.js"

const JobCategories = ()=>{

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore opportunities across different industries and find the perfect match for your skills
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.id}
                className={`${category.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group`}
              >
                <div
                  className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3
                  className={`font-semibold mb-2 ${category.textColor} group-hover:text-opacity-80 transition-colors duration-300`}
                >
                  {category.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{category.jobCount} jobs</p>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Can't find what you're looking for?</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  )
}

export default JobCategories
