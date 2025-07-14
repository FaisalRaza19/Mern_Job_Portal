import React from 'react'
import { FaUsers, FaSearch, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

const About = ()=>{
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Connecting Talent with Opportunity</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
            Discover your dream career or find the perfect candidate. JobConnect makes professional connections simple,
            efficient, and meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 dark:hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Find Your Dream Job
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 dark:hover:bg-gray-100 dark:hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                  <FaUsers className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Our mission is to empower individuals to find fulfilling careers and help companies discover exceptional
                talent. We believe that the right connection between talent and opportunity can transform lives and
                drive innovation across industries.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                  <FaSearch className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                To become the world's most trusted platform where career aspirations meet business needs. We envision a
                future where finding the perfect job or candidate is seamless, transparent, and accessible to everyone,
                everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Why Choose JobConnect?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide comprehensive solutions for both job seekers and employers, making the hiring process efficient
              and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 group">
              <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaSearch className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Extensive Job Listings</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access thousands of job opportunities across various industries and experience levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 group">
              <div className="bg-green-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaBriefcase className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Easy Application Process</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Apply to multiple jobs with just one click using our streamlined application system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 group">
              <div className="bg-purple-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Advanced Matching</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI-powered matching system connects the right candidates with the right opportunities.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 group">
              <div className="bg-orange-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Real-time Notifications</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay updated with instant notifications about new job postings and application status.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 group">
              <div className="bg-red-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our dedicated support team is available around the clock to assist you.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 group">
              <div className="bg-teal-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Global Reach</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with opportunities worldwide with our extensive network of employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 text-blue-100 dark:text-blue-200 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect career match through JobConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 dark:hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Job Search
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 dark:hover:bg-gray-100 dark:hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Hire Top Talent
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
