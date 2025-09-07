import React from "react"
import { FaSearch } from "react-icons/fa"

const JobFilter = ({ filters, onChange }) => {
    const { search, role, location, salary, remoteOnly } = filters

    return (
        <div className="grid gap-4 md:grid-cols-6">
            {/* Search */}
            <div className="relative col-span-6 md:col-span-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onChange({ search: e.target.value })}
                    placeholder="Search job titles..."
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Role */}
            <select
                value={role}
                onChange={(e) => onChange({ role: e.target.value })}
                className="col-span-6 md:col-span-1 rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            >
                <option value="">All Roles</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UX Designer">UX Designer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            </select>

            {/* Location */}
            <select
                value={location}
                onChange={(e) => onChange({ location: e.target.value })}
                className="col-span-6 md:col-span-1 rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="New York, NY">New York, NY</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
            </select>

            {/* Salary */}
            <select
                value={salary}
                onChange={(e) => onChange({ salary: e.target.value })}
                className="col-span-6 md:col-span-1 rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            >
                <option value="">All Salaries</option>
                <option value="$50000 - $70000">$50k - $70k</option>
                <option value="$70000 - $90000">$70k - $90k</option>
                <option value="$90000 - $120000">$90k - $120k</option>
                <option value="$120000 - $150000">$120k - $150k</option>
            </select>

            {/* Remote */}
            <div className="col-span-6 md:col-span-1 flex items-center space-x-2">
                <input
                    id="remote"
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => onChange({ remoteOnly: e.target.checked })}
                    className="h-4 w-4 rounded text-gray-900 border-gray-300 focus:ring-gray-500"
                />
                <label htmlFor="remote" className="text-sm text-gray-700">
                    Remote Only
                </label>
            </div>
        </div>
    )
}

export default JobFilter
