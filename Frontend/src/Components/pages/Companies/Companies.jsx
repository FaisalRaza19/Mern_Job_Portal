import React, { useState, useEffect, useRef, useCallback } from "react"
import CompanyCard from "./components/CompanyCard.jsx"
import CompanySearchBar from "./components/CompanySearch.jsx"
import CompanyFilter from "./components/CompanyFilter.jsx"
import { FiAlertCircle } from "react-icons/fi"

// Mock Data
const allCompanies = [
    {
        id: "1",
        name: "Tech Solutions Inc.",
        logo: "/placeholder.svg?height=64&width=64",
        location: "New York, USA",
        industry: "Technology",
        rating: 4.5,
        size: "201-1000",
    },
    {
        id: "2",
        name: "Global Finance Group",
        logo: "/placeholder.svg?height=64&width=64",
        location: "London, UK",
        industry: "Finance",
        rating: 4.2,
        size: "1000+",
    },
    {
        id: "3",
        name: "Health Innovations",
        logo: "/placeholder.svg?height=64&width=64",
        location: "San Francisco, USA",
        industry: "Healthcare",
        rating: 4.8,
        size: "51-200",
    },
    {
        id: "4",
        name: "Creative Design Studio",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Berlin, Germany",
        industry: "Design",
        rating: 4.0,
        size: "1-50",
    },
    {
        id: "5",
        name: "Future AI Labs",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Seattle, USA",
        industry: "Technology",
        rating: 4.7,
        size: "51-200",
    },
    {
        id: "6",
        name: "Green Energy Corp",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Sydney, Australia",
        industry: "Energy",
        rating: 4.1,
        size: "201-1000",
    },
    {
        id: "7",
        name: "EduTech Solutions",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Toronto, Canada",
        industry: "Education",
        rating: 4.3,
        size: "51-200",
    },
    {
        id: "8",
        name: "Logistics Masters",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Dubai, UAE",
        industry: "Logistics",
        rating: 3.9,
        size: "1000+",
    },
    {
        id: "9",
        name: "Fashion Forward",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Paris, France",
        industry: "Fashion",
        rating: 4.6,
        size: "1-50",
    },
    {
        id: "10",
        name: "Cyber Security Inc.",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Tel Aviv, Israel",
        industry: "Cybersecurity",
        rating: 4.4,
        size: "201-1000",
    },
    {
        id: "11",
        name: "BioPharma Research",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Boston, USA",
        industry: "Healthcare",
        rating: 4.9,
        size: "51-200",
    },
    {
        id: "12",
        name: "Digital Marketing Pro",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Austin, USA",
        industry: "Marketing",
        rating: 4.2,
        size: "1-50",
    },
    {
        id: "13",
        name: "Automotive Innovations",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Detroit, USA",
        industry: "Automotive",
        rating: 4.0,
        size: "1000+",
    },
    {
        id: "14",
        name: "Foodie Delights",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Chicago, USA",
        industry: "Food & Beverage",
        rating: 4.5,
        size: "51-200",
    },
    {
        id: "15",
        name: "Construction Solutions",
        logo: "/placeholder.svg?height=64&width=64",
        location: "Houston, USA",
        industry: "Construction",
        rating: 3.8,
        size: "201-1000",
    },
]

const companies = () => {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({ location: "", industry: "", size: "" })
    const [filteredAllCompanies, setFilteredAllCompanies] = useState([])

    const companiesPerPage = 10
    const observerTarget = useRef(null)

    const filterAndLoadInitial = useCallback(() => {
        setLoading(true)
        const filtered = allCompanies.filter((company) => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesLocation = filters.location ? company.location.includes(filters.location) : true
            const matchesIndustry = filters.industry ? company.industry.includes(filters.industry) : true
            const matchesSize = filters.size ? company.size === filters.size : true
            return matchesSearch && matchesLocation && matchesIndustry && matchesSize
        })
        setFilteredAllCompanies(filtered)
        setCompanies(filtered.slice(0, companiesPerPage))
        setHasMore(filtered.length > companiesPerPage)
        setLoading(false)
    }, [searchTerm, filters])

    const loadMoreCompanies = useCallback(() => {
        if (loading || !hasMore) return

        setLoading(true)
        setTimeout(() => {
            const currentLoadedCount = companies.length
            const newCompanies = filteredAllCompanies.slice(currentLoadedCount, currentLoadedCount + companiesPerPage)

            setCompanies((prevCompanies) => [...prevCompanies, ...newCompanies])
            setHasMore(filteredAllCompanies.length > currentLoadedCount + companiesPerPage)
            setLoading(false)
        }, 1000) // Simulate network request
    }, [loading, hasMore, companies.length, filteredAllCompanies])

    useEffect(() => {
        filterAndLoadInitial()
    }, [filterAndLoadInitial])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMoreCompanies()
                }
            },
            { threshold: 1.0 }, // Trigger when the target is fully visible
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [loading, hasMore, loadMoreCompanies])

    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    const handleFilter = (newFilters) => {
        setFilters(newFilters)
    }

    return (
        <main className="min-h-screen md:p-8 border-b-cyan-600">
            <section className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-50">Find Your Next Company</h1>

                {/* Search & Filters */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
                    <CompanySearchBar onSearch={handleSearch} />
                    <CompanyFilter onFilter={handleFilter} />
                </div>

                {/* Company Grid */}
                {companies.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                        <FiAlertCircle className="mb-4 h-16 w-16" />
                        <p className="text-xl font-semibold">No companies found.</p>
                        <p className="mt-2 text-center">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {companies.map((company, index) => (
                            <CompanyCard key={company.id} company={company} index={index}/>
                        ))}
                    </div>
                )}

                {/* Infinite Scroll Loader */}
                {hasMore && (
                    <div className="mt-10 flex justify-center" ref={observerTarget}>
                        {loading && (
                            <span className="flex items-center text-lg font-medium text-gray-500 dark:text-gray-400">
                                <span className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-500 dark:border-gray-400" />
                                Loading more companies...
                            </span>
                        )}
                    </div>
                )}
                {!hasMore && companies.length > 0 && (
                    <div className="mt-10 flex justify-center text-gray-500 dark:text-gray-400">
                        <p>You've reached the end of the list!</p>
                    </div>
                )}
            </section>
        </main>
    )
}

export default companies
