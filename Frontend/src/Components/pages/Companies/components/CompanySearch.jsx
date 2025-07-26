import React, { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"

const CompanySearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
        onSearch(e.target.value)
    }

    return (
        <div
            className={`relative flex-1 transition-all duration-500 ease-out ${isVisible ? "translate-y-0 opacity-100 delay-100" : "translate-y-4 opacity-0"
                }`}
        >
            <FaSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
                type="text"
                placeholder="Search companies by name..."
                value={searchTerm}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-gray-900 shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
            />
        </div>
    )
}

export default CompanySearch
