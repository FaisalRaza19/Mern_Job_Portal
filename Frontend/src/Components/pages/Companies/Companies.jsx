import React, { useState, useEffect, useRef, useCallback, useContext } from "react"
import CompanyCard from "./components/CompanyCard.jsx"
import CompanyCardSkeleton from "./components/Skeleton/CompanyCard.jsx"
import CompanySearchBar from "./components/CompanySearch.jsx"
import CompanyFilter from "./components/CompanyFilter.jsx"
import { FiAlertCircle } from "react-icons/fi"
import { Context } from "../../../Context/context.jsx"

const Companies = () => {
    const { Jobs } = useContext(Context)
    const { allCompanies } = Jobs

    const [allCompanyData, setAllCompanyData] = useState([])
    const [displayedCompanies, setDisplayedCompanies] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({ location: "", industry: "", size: "" })
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)

    const companiesPerPage = 10
    const observerTarget = useRef(null)

    const fetchCompanies = async () => {
        try {
            const data = await allCompanies()
            setAllCompanyData(data?.data)
            setFilteredData(data?.data)
            setDisplayedCompanies(data?.data?.slice(0, companiesPerPage))
            setHasMore(data?.data?.length > companiesPerPage)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching companies:", error)
        }
    }

    useEffect(() => {
        fetchCompanies()
    }, [])

    useEffect(() => {
        const filtered = allCompanyData?.filter((company) => {
            const name = company?.companyInfo?.companyName?.toLowerCase() || ""
            const location = company?.companyInfo?.companyLocation || ""
            const industry = company?.companyInfo?.companyType || ""
            const size = company?.companyInfo?.companySize || ""

            return (
                name?.includes(searchTerm.toLowerCase()) &&
                (filters?.location ? location?.includes(filters?.location) : true) &&
                (filters?.industry ? industry?.includes(filters?.industry) : true) &&
                (filters?.size ? size === filters?.size : true)
            )
        })

        setFilteredData(filtered)
        setDisplayedCompanies(filtered?.slice(0, companiesPerPage))
        setHasMore(filtered?.length > companiesPerPage)
    }, [searchTerm, filters, allCompanyData])

    const loadMoreCompanies = useCallback(() => {
        if (!hasMore || loading) return
        setLoading(true)

        setTimeout(() => {
            const currentCount = displayedCompanies?.length
            const more = filteredData?.slice(currentCount, currentCount + companiesPerPage)
            setDisplayedCompanies((prev) => [...prev, ...more])
            setHasMore(filteredData?.length > currentCount + companiesPerPage)
            setLoading(false)
        }, 800)
    }, [filteredData, displayedCompanies, hasMore, loading])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMoreCompanies()
        }, { threshold: 1.0 })

        if (observerTarget.current) observer.observe(observerTarget.current)

        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current)
        }
    }, [loadMoreCompanies])

    return (
        <main className="min-h-screen m-4 md:p-8 border-b-cyan-600">
            <section className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">Find Your Next Company</h1>

                {/* Search & Filters */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
                    <CompanySearchBar onSearch={setSearchTerm} />
                    <CompanyFilter onFilter={setFilters} />
                </div>

                {/* Company Grid */}
                {filteredData?.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <FiAlertCircle className="mb-4 h-16 w-16" />
                        <p className="text-xl font-semibold">No companies found.</p>
                        <p className="mt-2 text-center">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {loading && displayedCompanies?.length === 0
                            ? Array?.from({ length: 8 })?.map((_, i) => <CompanyCardSkeleton key={i} />)
                            : displayedCompanies?.map((company, index) => (
                                <CompanyCard key={company?._id} company={company} index={index} />
                            ))}
                    </div>
                )}


                {/* Infinite Loader */}
                <div ref={observerTarget} className="mt-10 flex justify-center">
                    {loading && hasMore && (
                        <span className="flex items-center text-lg font-medium text-gray-500">
                            <span className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-500" />
                            Loading more companies...
                        </span>
                    )}
                </div>

                {!hasMore && displayedCompanies?.length > 0 && (
                    <div className="mt-10 flex justify-center text-gray-500 ">
                        <p>You've reached the end of the list!</p>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Companies
