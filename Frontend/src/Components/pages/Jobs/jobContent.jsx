import React, { useState, useEffect, useContext } from "react"
import JobCard from "./jobCard.jsx"
import JobFilterSidebar from "./filterSidebar.jsx"
import JobSkeleton from "./jobSkeleton.jsx"
import Pagination from "./pagination.jsx"
import { Context } from "../../../Context/context.jsx"

const JOBS_PER_PAGE = 5

const JobContent = () => {
    const { Jobs} = useContext(Context)
    const { allJob } = Jobs
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalFilteredJobsCount, setTotalFilteredJobsCount] = useState(0)

    const [allJobs, setAllJobs] = useState([]);

    const fetchAndFilterJobs = async () => {
        try {
            setLoading(true)
            const data = await allJob();
            const fetchedJobs = data.data;
            setAllJobs(fetchedJobs);
        } catch (error) {
            console.error("Error getting all jobs:", error.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchAndFilterJobs();
    }, []);

    const initialFilters = {
        keyword: "",
        jobType: "",
        location: "",
        experience: "",
        minSalary: "",
        maxSalary: "",
        skills: "",
        isRemote: false,
    };


    const [filters, setFilters] = useState(initialFilters)

    const filterAndPaginateJobs = (page, currentFilters) => {
        setLoading(true);

        setTimeout(() => {
            const filtered = allJobs.filter((job) => {
                // Parse skills safely
                let jobSkills = [];
                if (Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0) {
                    try {
                        jobSkills = JSON.parse(job.skillsRequired[0].replace(/'/g, '"'));
                    } catch (e) {
                        console.warn("Failed to parse skills for job:", job._id);
                    }
                }

                const keyword = currentFilters.keyword.toLowerCase();
                const companyName = job?.company?.companyInfo?.companyName?.toLowerCase() || "";
                const title = job.title?.toLowerCase() || "";

                const matchesKeyword = currentFilters.keyword
                    ? title.includes(keyword) || companyName.includes(keyword)
                    : true;

                const matchesJobType = currentFilters.jobType
                    ? job.employmentType === currentFilters.jobType
                    : true;

                const matchesLocation = currentFilters.isRemote
                    ? job.isRemote === true
                    : currentFilters.location
                        ? job.location?.toLowerCase().includes(currentFilters.location.toLowerCase())
                        : true;

                const matchesExperience = currentFilters.experience
                    ? job.experienceLevel === currentFilters.experience
                    : true;

                const matchesMinSalary = currentFilters.minSalary
                    ? job.salary?.min_salary >= parseInt(currentFilters.minSalary)
                    : true;

                const matchesMaxSalary = currentFilters.maxSalary
                    ? job.salary?.max_salary <= parseInt(currentFilters.maxSalary)
                    : true;

                const matchesSkills = currentFilters.skills
                    ? currentFilters.skills
                        .toLowerCase()
                        .split(",")
                        .some((filterSkill) =>
                            jobSkills.some((jobSkill) =>
                                jobSkill.toLowerCase().includes(filterSkill.trim())
                            )
                        )
                    : true;

                return (
                    matchesKeyword &&
                    matchesJobType &&
                    matchesLocation &&
                    matchesExperience &&
                    matchesMinSalary &&
                    matchesMaxSalary &&
                    matchesSkills
                );
            });

            const calculatedTotalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
            setTotalFilteredJobsCount(filtered.length);
            setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);

            const startIndex = (page - 1) * JOBS_PER_PAGE;
            const endIndex = startIndex + JOBS_PER_PAGE;
            const paginatedJobs = filtered.slice(startIndex, endIndex);

            setJobs(paginatedJobs);
            // setLoading(false);
        }, 500);
    };

    useEffect(() => {
        setCurrentPage(1);
        filterAndPaginateJobs(1, filters);
    }, [filters, allJobs]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            filterAndPaginateJobs(page, filters)
        }
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    const handleClearFilters = () => {
        setFilters(initialFilters)
    }

    return (
        <div className="grid mb-8 md:grid-cols-[280px_1fr] gap-8 mt-8 text-foreground">
            <aside>
                <JobFilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            </aside>

            <section>
                <h2 className="text-2xl font-bold mb-6 text-primary">Available Jobs</h2>

                {loading && jobs.length === 0 && totalFilteredJobsCount === 0 ? (
                    <div className="grid gap-6">
                        {Array.from({ length: JOBS_PER_PAGE }).map((_, index) => (
                            <JobSkeleton key={index} />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg">No jobs found matching your criteria.</p>
                        <p className="text-sm mt-2">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            </section>
        </div>
    )
}

export default JobContent
