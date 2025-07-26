import React, { useState } from "react"
import { FaFilter, FaChevronDown } from "react-icons/fa"

const JobFilter = ({ onFilter }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [role, setRole] = useState("")
    const [location, setLocation] = useState("")
    const [salary, setSalary] = useState("")

    const handleApplyFilters = () => {
        onFilter({ role, location, salary })
        setIsOpen(false)
    }

    const handleClearFilters = () => {
        setRole("")
        setLocation("")
        setSalary("")
        onFilter({ role: "", location: "", salary: "" })
        setIsOpen(false)
    }

    return (
        <div className="relative mb-6">
            {/* Mobile/Tablet Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800 md:hidden"
            >
                <FaFilter className="mr-2 h-5 w-5" />
                Filter Jobs
                <FaChevronDown className={`ml-2 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Desktop Filters */}
            <div className="hidden items-center justify-between md:flex md:space-x-4">
                <div className="flex flex-1 space-x-4">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                    >
                        <option value="">All Roles</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="UX Designer">UX Designer</option>
                        <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                        <option value="HR Business Partner">HR Business Partner</option>
                    </select>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                    >
                        <option value="">All Locations</option>
                        <option value="Remote">Remote</option>
                        <option value="New York, NY">New York, NY</option>
                        <option value="San Francisco">San Francisco</option>
                    </select>
                    <select
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                    >
                        <option value="">All Salaries</option>
                        <option value="$50,000 - $70,000">$50k-70k</option>
                        <option value="$70,000 - $90,000">$70k-90k</option>
                        <option value="$90,000 - $120,000">$90k-120k</option>
                        <option value="$100,000 - $130,000">$100k-130k</option>
                        <option value="$110,000 - $140,000">$110k-140k</option>
                        <option value="$120,000 - $150,000">$120k-150k</option>
                        <option value="$130,000 - $160,000">$130k-160k</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleApplyFilters}
                        className="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Dropdown Content */}
            {isOpen && (
                <div className="absolute left-0 right-0 z-10 mt-2 rounded-md border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:hidden">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="mobile-job-role"
                                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Role
                            </label>
                            <select
                                id="mobile-job-role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                            >
                                <option value="">All Roles</option>
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="Product Manager">Product Manager</option>
                                <option value="UX Designer">UX Designer</option>
                                <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                                <option value="HR Business Partner">HR Business Partner</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="mobile-job-location"
                                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Location
                            </label>
                            <select
                                id="mobile-job-location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                            >
                                <option value="">All Locations</option>
                                <option value="Remote">Remote</option>
                                <option value="New York, NY">New York, NY</option>
                                <option value="San Francisco">San Francisco</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="mobile-job-salary"
                                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Salary
                            </label>
                            <select
                                id="mobile-job-salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 pr-8 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                            >
                                <option value="">All Salaries</option>
                                <option value="$50,000 - $70,000">$50k-70k</option>
                                <option value="$70,000 - $90,000">$70k-90k</option>
                                <option value="$90,000 - $120,000">$90k-120k</option>
                                <option value="$100,000 - $130,000">$100k-130k</option>
                                <option value="$110,000 - $140,000">$110k-140k</option>
                                <option value="$120,000 - $150,000">$120k-150k</option>
                                <option value="$130,000 - $160,000">$130k-160k</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleClearFilters}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="rounded-md bg-gray-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobFilter
