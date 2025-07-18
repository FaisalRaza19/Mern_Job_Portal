// import React, { useState, useEffect } from "react"
// import {
//     FaMapMarkerAlt, FaDollarSign, FaClock, FaGraduationCap, FaCalendarAlt, FaUsers, FaTag, FaTimesCircle, FaArrowLeft,
// } from "react-icons/fa";
// import { useNavigate, useParams,} from "react-router-dom"
// import ApplyForm from "./jobApplyForm.jsx"
// import JobCard from "./jobCard.jsx"

// const jobDetails = () => {
//     const {jobId} = useParams()
//     console.log(jobId)
//     const [job, setJob] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [notFound, setNotFound] = useState(false)
//     const [showApplyForm, setShowApplyForm] = useState(false)
//     const [hasApplied, setHasApplied] = useState(false) // Simulate duplicate application prevention
//     const router = useNavigate();

//     useEffect(() => {
//         setLoading(true)
//         setNotFound(false)
//         setShowApplyForm(false) // Reset form visibility on job change
//         setHasApplied(false) // Reset application status

//         // Simulate API call
//         setTimeout(() => {
//             const foundJob = mockJobs.find((j) => j.id === jobId)
//             if (foundJob) {
//                 setJob(foundJob)
//             } else {
//                 setNotFound(true)
//             }
//             setLoading(false)
//         }, 500)
//     }, [jobId])

//     const getSuggestedJobs = (currentJob) => {
//         const suggested = mockJobs.filter((j) =>
//                 j.id !== currentJob.id &&
//                 (j.type === currentJob.type || j.skills.some((skill) => currentJob.skills.includes(skill))),
//         )
//         // Shuffle and take top 3
//         return suggested.sort(() => 0.5 - Math.random()).slice(0, 3)
//     }

//     if (loading) {
//         return (
//             <div className="bg-card text-card-foreground rounded-lg shadow-sm p-8 border border-border animate-pulse">
//                 <div className="flex items-center gap-4 mb-6">
//                     <div className="w-16 h-16 bg-muted rounded-full" />
//                     <div className="flex-1 space-y-2">
//                         <div className="h-8 bg-muted rounded w-3/4" />
//                         <div className="h-5 bg-muted rounded w-1/2" />
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     <div className="h-5 bg-muted rounded w-full" />
//                     <div className="h-5 bg-muted rounded w-full" />
//                     <div className="h-5 bg-muted rounded w-full" />
//                     <div className="h-5 bg-muted rounded w-full" />
//                 </div>
//                 <div className="h-40 bg-muted rounded mb-8" />
//                 <div className="h-20 bg-muted rounded" />
//             </div>
//         )
//     }

//     if (notFound) {
//         return (
//             <div className="text-center py-20">
//                 <FaTimesCircle className="w-16 h-16 mx-auto text-destructive mb-4" /> {/* Changed usage */}
//                 <h2 className="text-2xl font-bold text-destructive">Job Not Found</h2>
//                 <p className="text-muted-foreground mt-2">The job you are looking for does not exist or has been removed.</p>
//                 <p className="text-muted-foreground mt-1">
//                     Please check the URL or go back to the{" "}
//                     <a href="/jobs" className="text-primary hover:underline">
//                         jobs list
//                     </a>
//                     .
//                 </p>
//             </div>
//         )
//     }

//     if (!job) {
//         return null // Should not happen if notFound is handled
//     }

//     const suggestedJobs = getSuggestedJobs(job)

//     return (
//         <div className="bg-card text-card-foreground rounded-lg shadow-sm p-8 border border-border">
//             <div className="flex items-center mb-6">
//                 <button
//                     onClick={() => router("/jobs")}
//                     className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0 mr-4"
//                     aria-label="Go back"
//                 >
//                     <FaArrowLeft className="h-5 w-5" /> {/* Changed usage */}
//                 </button>
//                 <h1 className="text-2xl font-bold text-primary">Job Details</h1>
//             </div>

//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
//                 <img
//                     src={job.logo || "/placeholder.svg"}
//                     alt={`${job.company} logo`}
//                     width={80}
//                     height={80}
//                     className="rounded-full border border-border p-2 bg-background"
//                 />
//                 <div className="flex-1">
//                     <h2 className="text-3xl font-bold text-primary mb-2">{job.title}</h2>
//                     <p className="text-xl text-muted-foreground">{job.company}</p>
//                 </div>
//                 <button
//                     onClick={() => setShowApplyForm(true)}
//                     disabled={hasApplied}
//                     className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
//                 >
//                     {hasApplied ? "Applied!" : "Apply Now"}
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-muted-foreground text-sm">
//                 <div className="flex items-center gap-2">
//                     <FaMapMarkerAlt className="w-4 h-4" /> {/* Changed usage */}
//                     <span>{job.location}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <FaDollarSign className="w-4 h-4" /> {/* Changed usage */}
//                     <span>{job.salary}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <FaClock className="w-4 h-4" /> {/* Changed usage */}
//                     <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-foreground">
//                         {job.type}
//                     </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <FaGraduationCap className="w-4 h-4" /> {/* Changed usage */}
//                     <span>{job.experience}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <FaCalendarAlt className="w-4 h-4" /> {/* Changed usage */}
//                     <span>Posted: {job.postedDate}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <FaCalendarAlt className="w-4 h-4" /> {/* Changed usage */}
//                     <span>Deadline: {job.deadline}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <FaUsers className="w-4 h-4" /> {/* Changed usage */}
//                     <span>Openings: {job.openings}</span>
//                 </div>
//             </div>

//             <div className="mb-8">
//                 <h3 className="text-xl font-semibold mb-4">Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {job.skills.map((skill, index) => (
//                         <span
//                             key={index}
//                             className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
//                         >
//                             <FaTag className="w-4 h-4 mr-1" /> {/* Changed usage */}
//                             {skill}
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             <div className="mb-8">
//                 <h3 className="text-xl font-semibold mb-4">Job Description</h3>
//                 <p className="text-muted-foreground leading-relaxed">{job.description}</p>
//             </div>

//             <div className="mb-8">
//                 <h3 className="text-xl font-semibold mb-4">Requirements</h3>
//                 <ul className="list-disc list-inside text-muted-foreground space-y-2">
//                     {job.requirements.map((req, index) => (
//                         <li key={index}>{req}</li>
//                     ))}
//                 </ul>
//             </div>

//             {showApplyForm && (
//                 <div className="mt-12 pt-8 border-t border-border">
//                     <ApplyForm
//                         jobId={job.id}
//                         jobTitle={job.title}
//                         companyName={job.company}
//                         companyLogo={job.logo}
//                         onApplySuccess={() => setHasApplied(true)}
//                         onBack={() => setShowApplyForm(false)}
//                     />
//                 </div>
//             )}

//             {suggestedJobs.length > 0 && (
//                 <div className="mt-12 pt-8 border-t border-border">
//                     <h3 className="text-2xl font-bold mb-6">Suggested Jobs</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {suggestedJobs.map((sJob) => (
//                             <JobCard key={sJob.id} job={sJob} />
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default jobDetails

import React, { useState, useEffect } from "react";
import {
    FaMapMarkerAlt, FaDollarSign, FaClock, FaGraduationCap, FaCalendarAlt, FaUsers, FaTag, FaTimesCircle, FaArrowLeft
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ApplyForm from "./jobApplyForm.jsx";
import JobCard from "./jobCard.jsx";
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

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        setShowApplyForm(false);
        setHasApplied(false);

        setTimeout(() => {
            const foundJob = mockJobs.find((j) => j.id === jobId);
            if (foundJob) setJob(foundJob);
            else setNotFound(true);
            setLoading(false);
        }, 500);
    }, [jobId]);

    const getSuggestedJobs = (currentJob) => {
        return mockJobs
            .filter(
                (j) =>
                    j.id !== currentJob.id &&
                    (j.type === currentJob.type || j.skills.some((s) => currentJob.skills.includes(s)))
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    };

    if (loading) {
        return (
            <div className="bg-white mt-6 mb-8 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow p-8 border dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    ))}
                </div>
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-8" />
                <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="text-center py-20 text-gray-800 dark:text-gray-200">
                <FaTimesCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold">Job Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">This job does not exist or has been removed.</p>
                <a href="/jobs" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 block">
                    Go to Job Listings
                </a>
            </div>
        );
    }

    if (!job) return null;

    const suggestedJobs = getSuggestedJobs(job);

    return (
        <div className="bg-white mt-9 mb-9 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm p-8 border dark:border-gray-700">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/jobs")}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded-full mr-4"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Job Details</h1>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <img
                    src={job.logo || "/placeholder.svg"}
                    alt={`${job.company} logo`}
                    className="w-20 h-20 rounded-full border p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
                />
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-1">{job.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                </div>
                <button
                    onClick={() => setShowApplyForm(true)}
                    disabled={hasApplied}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {hasApplied ? "Applied!" : "Apply Now"}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-sm text-gray-700 dark:text-gray-300">
                <InfoItem icon={<FaMapMarkerAlt />} label={job.location} />
                <InfoItem icon={<FaDollarSign />} label={job.salary} />
                <InfoItem icon={<FaClock />} label={job.type} />
                <InfoItem icon={<FaGraduationCap />} label={job.experience} />
                <InfoItem icon={<FaCalendarAlt />} label={`Posted: ${job.postedDate}`} />
                <InfoItem icon={<FaCalendarAlt />} label={`Deadline: ${job.deadline}`} />
                <InfoItem icon={<FaUsers />} label={`Openings: ${job.openings}`} />
            </div>

            <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                        <span
                            key={i}
                            className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full"
                        >
                            <FaTag className="text-gray-600 dark:text-gray-300" />
                            {skill}
                        </span>
                    ))}
                </div>
            </Section>

            <Section title="Job Description">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.description}</p>
            </Section>

            <Section title="Requirements">
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {job.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                    ))}
                </ul>
            </Section>

            {showApplyForm && (
                <div className="mt-12 pt-8 border-t dark:border-gray-700">
                    <ApplyForm
                        jobId={job.id}
                        jobTitle={job.title}
                        companyName={job.company}
                        companyLogo={job.logo}
                        onApplySuccess={() => setHasApplied(true)}
                        onBack={() => setShowApplyForm(false)}
                    />
                </div>
            )}

            {suggestedJobs.length > 0 && (
                <div className="mt-12 pt-8 border-t dark:border-gray-700">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Suggested Jobs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestedJobs.map((sJob) => (
                            <JobCard key={sJob.id} job={sJob} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ icon, label }) => (
    <div className="flex items-center gap-2">
        <span className="text-blue-500 dark:text-blue-400">{icon}</span>
        <span>{label}</span>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
        {children}
    </div>
);

export default JobDetails;
