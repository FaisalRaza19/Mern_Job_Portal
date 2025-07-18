import React, { useState, useEffect } from "react"
import JobCard from "./jobCard.jsx"
import JobFilterSidebar from "./filterSidebar.jsx"
import JobSkeleton from "./jobSkeleton.jsx"
import Pagination from "./pagination.jsx"

const mockJobs = [
    {
        id: "1",
        title: "Frontend Developer",
        company: "Tech Solutions Inc.",
        location: "New York, NY",
        salary: "$90,000 - $110,000",
        type: "Full-time",
        experience: "Mid Level",
        skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
        postedDate: "2025-07-10",
        deadline: "2025-08-10",
        openings: 2,
        description:
            "We are looking for a passionate Frontend Developer to join our growing team. You will be responsible for developing and maintaining user-facing applications using modern web technologies. This role involves collaborating with cross-functional teams, participating in code reviews, and contributing to the overall architecture of our web applications. We value clean code, test-driven development, and continuous learning.",
        requirements: [
            "3+ years of experience with React and its ecosystem (Redux, Context API, Hooks)",
            "Proficiency in JavaScript (ES6+), HTML5, and CSS3",
            "Strong understanding of responsive design principles and mobile-first development",
            "Experience with modern CSS frameworks like Tailwind CSS or Styled Components",
            "Familiarity with RESTful APIs and asynchronous programming",
            "Knowledge of version control systems (Git) and agile development methodologies",
            "Bachelor's degree in Computer Science or a related field (or equivalent practical experience)",
            "Excellent problem-solving skills and attention to detail",
            "Ability to work independently and as part of a team",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "2",
        title: "Backend Engineer",
        company: "Global Innovations",
        location: "Remote",
        salary: "$100,000 - $130,000",
        type: "Remote",
        experience: "Senior Level",
        skills: ["Node.js", "Python", "AWS", "SQL", "Docker"],
        postedDate: "2025-07-05",
        deadline: "2025-08-05",
        openings: 1,
        description:
            "Join our backend team to build scalable and robust microservices. You will design, develop, and deploy backend systems that power our applications. This includes designing APIs, integrating with various data sources, and ensuring high performance and reliability of our services. We are looking for someone who is passionate about building resilient systems and enjoys tackling complex technical challenges.",
        requirements: [
            "5+ years of experience in backend development with Node.js or Python",
            "Strong knowledge of cloud platforms such as AWS, Azure, or Google Cloud Platform",
            "Experience with containerization technologies (Docker, Kubernetes)",
            "Proficiency in designing and optimizing relational (SQL) and NoSQL databases",
            "Familiarity with message queues (Kafka, RabbitMQ) and caching mechanisms (Redis)",
            "Experience with CI/CD pipelines and automated testing",
            "Bachelor's or Master's degree in Computer Science or a related field",
            "Excellent debugging and troubleshooting skills",
            "Ability to lead technical discussions and mentor junior engineers",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "3",
        title: "UI/UX Designer",
        company: "Creative Minds Studio",
        location: "San Francisco, CA",
        salary: "$80,000 - $100,000",
        type: "Full-time",
        experience: "Entry Level",
        skills: ["Figma", "Sketch", "User Research", "Prototyping", "Adobe XD"],
        postedDate: "2025-07-12",
        deadline: "2025-08-12",
        openings: 3,
        description:
            "We are seeking a talented UI/UX Designer to create intuitive and visually appealing user interfaces. You will work closely with product and engineering teams to translate user needs and business requirements into compelling design solutions. This role involves conducting user research, creating wireframes and prototypes, and ensuring the final product meets high usability and aesthetic standards.",
        requirements: [
            "Portfolio showcasing UI/UX design work for web and/or mobile applications",
            "Proficiency in design tools like Figma, Sketch, Adobe XD, or similar",
            "Strong understanding of user-centered design principles, usability, and accessibility",
            "Experience with creating wireframes, user flows, prototypes, and high-fidelity mockups",
            "Ability to conduct user research and translate findings into design improvements",
            "Excellent visual design skills with attention to detail and typography",
            "Strong communication and collaboration skills to work effectively with cross-functional teams",
            "Bachelor's degree in Design, HCI, or a related field (or equivalent practical experience)",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "4",
        title: "Data Scientist",
        company: "Data Insights Co.",
        location: "Boston, MA",
        salary: "$110,000 - $140,000",
        type: "Full-time",
        experience: "Mid Level",
        skills: ["Python", "R", "Machine Learning", "SQL", "Data Visualization"],
        postedDate: "2025-07-01",
        deadline: "2025-07-31",
        openings: 1,
        description:
            "Analyze complex datasets and build predictive models to drive business decisions. You will work on challenging problems and contribute to our data-driven culture. This role involves collecting, cleaning, and analyzing large datasets, developing and deploying machine learning models, and communicating insights to stakeholders. We are looking for a curious and analytical individual who can turn data into actionable strategies.",
        requirements: [
            "3+ years of experience in data science or a related analytical role",
            "Strong programming skills in Python or R, with experience in relevant libraries (e.g., pandas, numpy, scikit-learn, tensorflow, pytorch)",
            "Solid understanding of statistical modeling, machine learning algorithms, and experimental design",
            "Proficiency in SQL for data extraction and manipulation",
            "Experience with data visualization tools (e.g., Matplotlib, Seaborn, Tableau, Power BI)",
            "Ability to communicate complex analytical concepts to non-technical audiences",
            "Master's or Ph.D. in a quantitative field (e.g., Computer Science, Statistics, Mathematics, Economics)",
            "Experience with big data technologies (e.g., Spark, Hadoop) is a plus",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "5",
        title: "DevOps Engineer",
        company: "CloudOps Solutions",
        location: "Seattle, WA",
        salary: "$105,000 - $125,000",
        type: "Full-time",
        experience: "Senior Level",
        skills: ["Kubernetes", "Terraform", "CI/CD", "AWS", "Linux"],
        postedDate: "2025-06-28",
        deadline: "2025-07-28",
        openings: 2,
        description:
            "Automate and optimize our infrastructure and deployment pipelines. You will ensure the reliability and scalability of our systems. This role involves designing, implementing, and managing our cloud infrastructure, automating deployment processes, and monitoring system performance. We are looking for an experienced engineer who can build robust and efficient CI/CD pipelines and maintain highly available systems.",
        requirements: [
            "5+ years of experience in DevOps, Site Reliability Engineering (SRE), or similar roles",
            "Strong experience with cloud platforms (AWS, Azure, GCP) and infrastructure as code (Terraform, CloudFormation)",
            "Proficiency in containerization technologies (Docker, Kubernetes)",
            "Experience with CI/CD tools (e.g., Jenkins, GitLab CI, GitHub Actions)",
            "Solid understanding of Linux operating systems and scripting (Bash, Python)",
            "Knowledge of monitoring and logging tools (e.g., Prometheus, Grafana, ELK stack)",
            "Experience with network configuration, security, and troubleshooting",
            "Bachelor's degree in Computer Science or a related technical field",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "6",
        title: "Product Manager",
        company: "Innovate Products",
        location: "Remote",
        salary: "$120,000 - $150,000",
        type: "Remote",
        experience: "Senior Level",
        skills: ["Product Strategy", "Roadmapping", "Agile", "Market Research"],
        postedDate: "2025-07-08",
        deadline: "2025-08-08",
        openings: 1,
        description:
            "Define and execute the product roadmap for our flagship product. You will work cross-functionally to deliver innovative solutions. This role involves understanding market needs, defining product vision and strategy, prioritizing features, and collaborating with engineering, design, and marketing teams to bring products to life. We are looking for a strategic thinker with strong leadership and communication skills.",
        requirements: [
            "7+ years of product management experience, preferably in a tech-driven environment",
            "Proven track record of successfully launching and managing products throughout their lifecycle",
            "Strong analytical and problem-solving skills, with the ability to use data to inform decisions",
            "Deep understanding of agile development methodologies",
            "Excellent communication, presentation, and interpersonal skills",
            "Ability to influence and lead cross-functional teams without direct authority",
            "Experience with market research, competitive analysis, and user feedback gathering",
            "Bachelor's degree in a relevant field (e.g., Business, Computer Science, Engineering)",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "7",
        title: "Mobile App Developer",
        company: "AppGenius",
        location: "Austin, TX",
        salary: "$95,000 - $115,000",
        type: "Full-time",
        experience: "Mid Level",
        skills: ["React Native", "Swift", "Kotlin", "Firebase"],
        postedDate: "2025-07-03",
        deadline: "2025-08-03",
        openings: 2,
        description:
            "Develop and maintain high-quality mobile applications for iOS and Android. You will contribute to the entire app lifecycle, from concept and design to testing and deployment. This role requires a strong understanding of mobile development best practices, performance optimization, and user experience. We are looking for a creative and detail-oriented developer who can build engaging and robust mobile experiences.",
        requirements: [
            "3+ years of mobile development experience with React Native or native iOS/Android (Swift/Kotlin)",
            "Proficiency in JavaScript/TypeScript for React Native, or Swift/Kotlin for native development",
            "Experience with mobile UI/UX design principles and guidelines",
            "Familiarity with mobile API integration and third-party libraries",
            "Knowledge of mobile testing frameworks and debugging tools",
            "Experience with cloud platforms and services (e.g., Firebase, AWS Amplify) for mobile backend",
            "Ability to work in an agile development environment",
            "Bachelor's degree in Computer Science or a related field",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "8",
        title: "Cybersecurity Analyst",
        company: "SecureNet Solutions",
        location: "Washington, D.C.",
        salary: "$85,000 - $105,000",
        type: "Full-time",
        experience: "Entry Level",
        skills: ["Network Security", "Incident Response", "Vulnerability Assessment", "SIEM"],
        postedDate: "2025-07-15",
        deadline: "2025-08-15",
        openings: 1,
        description:
            "Monitor and protect our systems from cyber threats. You will perform security assessments and respond to incidents. This role involves analyzing security alerts, conducting vulnerability scans, assisting with incident response, and implementing security best practices. We are looking for a proactive individual with a strong interest in cybersecurity and a desire to learn and grow in the field.",
        requirements: [
            "1+ year of experience in cybersecurity, IT security, or a related field",
            "Knowledge of network security principles, protocols, and technologies (e.g., firewalls, IDS/IPS)",
            "Familiarity with common cybersecurity frameworks (e.g., NIST, ISO 27001)",
            "Understanding of vulnerability assessment and penetration testing concepts",
            "Experience with Security Information and Event Management (SIEM) tools is a plus",
            "Strong analytical and problem-solving skills",
            "Excellent communication skills, both written and verbal",
            "Relevant certifications (e.g., CompTIA Security+, CEH) are a plus",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "9",
        title: "Marketing Specialist",
        company: "Brand Builders",
        location: "Chicago, IL",
        salary: "$60,000 - $80,000",
        type: "Full-time",
        experience: "Entry Level",
        skills: ["Digital Marketing", "SEO", "Content Creation", "Social Media"],
        postedDate: "2025-07-09",
        deadline: "2025-08-09",
        openings: 2,
        description:
            "Develop and execute marketing campaigns to promote our products and services. You will manage our online presence and engage with our audience. This role involves creating compelling content, managing social media channels, optimizing for search engines, and analyzing campaign performance. We are looking for a creative and results-driven marketer who can effectively reach and engage our target audience.",
        requirements: [
            "2+ years of experience in digital marketing or a related field",
            "Strong understanding of digital marketing channels (e.g., SEO, SEM, social media, email marketing)",
            "Experience with content creation (e.g., blog posts, social media copy, website content)",
            "Familiarity with marketing analytics tools (e.g., Google Analytics)",
            "Excellent written and verbal communication skills",
            "Ability to work independently and collaboratively in a fast-paced environment",
            "Bachelor's degree in Marketing, Communications, or a related field",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
    {
        id: "10",
        title: "HR Manager",
        company: "People First Corp.",
        location: "Denver, CO",
        salary: "$75,000 - $95,000",
        type: "Full-time",
        experience: "Mid Level",
        skills: ["Recruitment", "Employee Relations", "HR Policies", "Payroll"],
        postedDate: "2025-07-02",
        deadline: "2025-08-02",
        openings: 1,
        description:
            "Oversee all HR functions, including recruitment, employee relations, and compliance. You will support our employees and foster a positive work environment. This role involves managing the full recruitment lifecycle, developing and implementing HR policies, handling employee relations issues, and ensuring compliance with labor laws. We are looking for a compassionate and organized HR professional who can contribute to a thriving workplace culture.",
        requirements: [
            "4+ years of progressive HR experience, with at least 2 years in a management role",
            "Strong knowledge of HR best practices, employment laws, and regulations",
            "Experience with recruitment, onboarding, performance management, and employee relations",
            "Excellent interpersonal, communication, and conflict resolution skills",
            "Ability to maintain confidentiality and exercise discretion",
            "Proficiency in HRIS systems and Microsoft Office Suite",
            "Bachelor's degree in Human Resources, Business Administration, or a related field",
            "HR certification (e.g., SHRM-CP, PHR) is a plus",
        ],
        logo: "/placeholder.svg?height=64&width=64",
    },
]
const JOBS_PER_PAGE = 5

const JobContent = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalFilteredJobsCount, setTotalFilteredJobsCount] = useState(0)

    const initialFilters = {
        keyword: "",
        jobType: "",
        location: "",
        experience: "",
        minSalary: "",
        maxSalary: "",
        skills: "",
    }

    const [filters, setFilters] = useState(initialFilters)

    const filterAndPaginateJobs = (page, currentFilters) => {
        setLoading(true)

        setTimeout(() => {
            const filtered = mockJobs.filter((job) => {
                const matchesKeyword = currentFilters.keyword
                    ? job.title.toLowerCase().includes(currentFilters.keyword.toLowerCase()) ||
                    job.company.toLowerCase().includes(currentFilters.keyword.toLowerCase())
                    : true

                const matchesJobType = currentFilters.jobType ? job.type === currentFilters.jobType : true

                const matchesLocation = currentFilters.location
                    ? job.location.toLowerCase().includes(currentFilters.location.toLowerCase())
                    : true

                const matchesExperience = currentFilters.experience ? job.experience === currentFilters.experience : true

                const jobSalaryNum = Number.parseInt(job.salary.replace(/[^0-9]/g, ""))
                const matchesMinSalary = currentFilters.minSalary
                    ? jobSalaryNum >= Number.parseInt(currentFilters.minSalary)
                    : true

                const matchesMaxSalary = currentFilters.maxSalary
                    ? jobSalaryNum <= Number.parseInt(currentFilters.maxSalary)
                    : true

                const matchesSkills = currentFilters.skills
                    ? currentFilters.skills
                        .toLowerCase()
                        .split(",")
                        .some((filterSkill) =>
                            job.skills.some((jobSkill) =>
                                jobSkill.toLowerCase().includes(filterSkill.trim())
                            )
                        )
                    : true

                return (
                    matchesKeyword &&
                    matchesJobType &&
                    matchesLocation &&
                    matchesExperience &&
                    matchesMinSalary &&
                    matchesMaxSalary &&
                    matchesSkills
                )
            })

            setTotalFilteredJobsCount(filtered.length)
            const calculatedTotalPages = Math.ceil(filtered.length / JOBS_PER_PAGE)
            setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1)

            const startIndex = (page - 1) * JOBS_PER_PAGE
            const endIndex = startIndex + JOBS_PER_PAGE
            const paginatedJobs = filtered.slice(startIndex, endIndex)

            setJobs(paginatedJobs)
            setLoading(false)
        }, 500)
    }

    useEffect(() => {
        setCurrentPage(1)
        filterAndPaginateJobs(1, filters)
    }, [filters])

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
                            <JobCard key={job.id} job={job} />
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
