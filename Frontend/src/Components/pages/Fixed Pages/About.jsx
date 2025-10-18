import React, { useContext } from 'react'
import { FaUsers, FaSearch, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import { Link } from 'react-router-dom'
import { Context } from '../../../Context/context'

const About = () => {
  const { isEmployer } = useContext(Context)
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[40px] font-bold mb-6 animate-fade-in">Connecting Talent with Opportunity</h1>
          <p className="text-[14px] mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover your dream career or find the perfect candidate. JobConnect makes professional connections simple,
            efficient, and meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/jobs"}>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-[14px] hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Find Your Dream Job
              </button>
            </Link>
            <Link to={isEmployer ? "/employer-dashboard" : "/register"}>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-[14px] hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Post a Job
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>
                <h2 className="text-[18px] font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                Our mission is to empower individuals to find fulfilling careers and help companies discover exceptional
                talent. We believe that the right connection between talent and opportunity can transform lives and
                drive innovation across industries.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaSearch className="text-2xl text-green-600" />
                </div>
                <h2 className="text-[18px] font-bold text-gray-800">Our Vision</h2>
              </div>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                To become the world's most trusted platform where career aspirations meet business needs. We envision a
                future where finding the perfect job or candidate is seamless, transparent, and accessible to everyone,
                everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-bold text-gray-800 mb-4">Why Choose JobConnect?</h2>
            <p className="text-[14px] text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive solutions for both job seekers and employers, making the hiring process efficient
              and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Features */}
            {[
              { icon: FaSearch, title: "Extensive Job Listings", text: "Access thousands of job opportunities across various industries and experience levels.", bg: "bg-blue-600" },
              { icon: FaBriefcase, title: "Easy Application Process", text: "Apply to multiple jobs with just one click using our streamlined application system.", bg: "bg-green-600" },
              { icon: FaUsers, title: "Advanced Matching", text: "Our AI-powered matching system connects the right candidates with the right opportunities.", bg: "bg-purple-600" },
              { icon: FaEnvelope, title: "Real-time Notifications", text: "Stay updated with instant notifications about new job postings and application status.", bg: "bg-orange-600" },
              { icon: FaPhone, title: "24/7 Support", text: "Our dedicated support team is available around the clock to assist you.", bg: "bg-red-600" },
              { icon: FaMapMarkerAlt, title: "Global Reach", text: "Connect with opportunities worldwide with our extensive network of employers.", bg: "bg-teal-600" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:bg-blue-50 transition-all duration-300 group">
                <div className={`${feature.bg} text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-[14px] text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[40px] font-bold mb-6">Ready to Take the Next Step?</h2>
          <p className="text-[14px] mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect career match through JobConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-[14px] hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Job Search
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-[14px] hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Hire Top Talent
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
