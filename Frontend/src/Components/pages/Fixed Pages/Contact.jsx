import React from 'react'
import { useState } from "react"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa"

const Contact = () => {
    const [openFaq, setOpenFaq] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, })
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        alert("Thank you for your message! We'll get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
    }

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <div>
            {/* Contact Hero Section */}
            <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Get In Touch</h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300 dark:text-gray-400 max-w-3xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Form and Info Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-2xl">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Contact Details */}
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-2xl">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                                            <FaEnvelope className="text-xl text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white">Email</h3>
                                            <p className="text-gray-600 dark:text-gray-300">info@jobportal.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                                            <FaPhone className="text-xl text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white">Phone</h3>
                                            <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mr-4">
                                            <FaMapMarkerAlt className="text-xl text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white">Address</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                123 Career Lane, Suite 400
                                                <br />
                                                Jobsville, JS 12345
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg dark:shadow-2xl">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Location</h3>
                                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <FaMapMarkerAlt className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">Interactive Map Placeholder</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm">Map integration would go here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Find answers to common questions about JobPortal
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* FAQ Items */}
                        {[
                            {
                                question: "How do I create an account on JobPortal?",
                                answer:
                                    "Creating an account is simple! Click on the 'Sign Up' button, fill in your basic information, and verify your email address. You can then complete your profile and start applying for jobs immediately.",
                            },
                            {
                                question: "Is JobPortal free to use for job seekers?",
                                answer:
                                    "Yes, JobPortal is completely free for job seekers. You can search for jobs, apply to positions, and use all our career resources at no cost. We only charge employers for posting jobs and accessing premium features.",
                            },
                            {
                                question: "How do I apply for a job?",
                                answer:
                                    "Once you find a job you're interested in, click on the job title to view the full description. Then click the 'Apply Now' button and follow the prompts to submit your application along with your resume and cover letter.",
                            },
                            {
                                question: "Can employers contact me directly?",
                                answer:
                                    "Yes, if you make your profile visible to employers, they can contact you directly about job opportunities that match your skills and experience. You can control your privacy settings in your account preferences.",
                            },
                            {
                                question: "How do I post a job as an employer?",
                                answer:
                                    "Employers can post jobs by creating a company account, selecting a posting package, and filling out the job description form. Once submitted, jobs are typically live within 24 hours after review.",
                            },
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{faq.question}</h3>
                                    {openFaq === index ? (
                                        <FaChevronUp className="text-blue-600 dark:text-blue-400" />
                                    ) : (
                                        <FaChevronDown className="text-gray-400 dark:text-gray-500" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
