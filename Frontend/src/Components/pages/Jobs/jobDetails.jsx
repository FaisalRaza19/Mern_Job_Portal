import React, { useState, useEffect, useContext } from "react";
import {
    FaMapMarkerAlt, FaDollarSign, FaClock, FaGraduationCap, FaCalendarAlt, FaUsers, FaTag, FaTimesCircle, FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";
import ApplyForm from "./jobApplyForm.jsx";
import JobCard from "./jobCard.jsx";
import { Context } from "../../../Context/context.jsx";

const JobDetails = () => {
    const { Jobs, userData, JobsAction } = useContext(Context);
    const { appliedJobIds } = JobsAction
    const user = userData
    const { getJobFromId, allJob } = Jobs;
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const isApplied = appliedJobIds.includes(jobId)

    const jobData = async () => {
        setLoading(true);
        setNotFound(false);
        setShowApplyForm(false);

        try {
            const data = await getJobFromId({ jobId });
            if (data.statusCode === 200) {
                const jobData = data.data;
                setJob(jobData);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error("Error fetching job:", error.message);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        jobData();
    }, [jobId]);

    const parsedSkills = (() => {
        if (!job?.skillsRequired || job.skillsRequired.length === 0) return [];
        try {
            const first = job.skillsRequired[0];
            if (typeof first === "string" && first.includes("[")) {
                return JSON.parse(first.replace(/'/g, '"'));
            }
            return job.skillsRequired;
        } catch (err) {
            console.warn("Skill parse error:", err);
            return [];
        }
    })();

    useEffect(() => {
        if (userData?.skills && parsedSkills.length > 0) {
            const suggested = userData.skills.filter(skill => !parsedSkills.includes(skill));
            setSuggestedSkills(suggested);
        }
    }, [userData, parsedSkills]);

    const parseSkills = (skills) => {
        if (!skills || skills.length === 0) return [];
        try {
            const first = skills[0];
            if (typeof first === "string" && first.includes("[")) {
                return JSON.parse(first.replace(/'/g, '"'));
            }
            return skills;
        } catch (err) {
            return [];
        }
    };

    const loadSuggestedJobs = async () => {
        try {
            const data = await allJob();
            const jobs = data.data || [];
            const userSkills = userData?.skills?.map(skill => skill.toLowerCase()) || [];

            const filtered = jobs.filter(j => j._id !== jobId);

            const matched = filtered.filter(jobItem => {
                const jobSkills = parseSkills(jobItem.skillsRequired).map(s => s.toLowerCase());
                return jobSkills.some(skill => userSkills.includes(skill));
            });

            if (matched.length > 0) {
                setSuggestedJobs(matched.slice(0, 5));
            } else {
                const shuffled = filtered.sort(() => 0.5 - Math.random());
                setSuggestedJobs(shuffled.slice(0, 5));
            }
        } catch (err) {
            console.log("Error loading suggested jobs:", err.message);
        }
    };

    useEffect(() => {
        loadSuggestedJobs();
    }, [userData, jobId]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    if (loading) {
        return (
            <div className="bg-white mt-6 mb-8 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow p-8 border dark:border-gray-700 animate-pulse">
                {/* Skeleton UI */}
            </div>
        );
    }

    if (notFound || !job) {
        return (
            <div className="text-center py-20 text-gray-800 dark:text-gray-200">
                <FaTimesCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold">Job Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    This job does not exist or has been removed.
                </p>
                <Link to="/jobs" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 block">
                    Go to Job Listings
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Job Detail Section */}
            <div className="bg-white mt-9 mb-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm p-8 border dark:border-gray-700">
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
                        src={job?.company?.avatar?.avatar_Url || "/placeholder.svg"}
                        className="w-20 h-20 rounded-full border p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
                        alt="Company Logo"
                    />
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-1">{job?.title || ""}</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {job?.company?.companyInfo?.companyName || ""}
                        </p>
                    </div>
                    {userData ? (
                        <button disabled={isApplied}
                            onClick={() => setShowApplyForm(true)}
                            className={`mt-2 px-4 py-2 rounded-md text-white text-sm font-medium ${isApplied
                                ? "bg-green-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {isApplied ? "Applied!" : "Apply Now"}
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-md"
                        >
                            Login to Apply
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-sm text-gray-700 dark:text-gray-300">
                    <InfoItem icon={<FaMapMarkerAlt />} label={job?.isRemote ? "Remote" : job?.location} />
                    <InfoItem icon={<FaDollarSign />} label={`${job?.salary?.min_salary || 0} - ${job?.salary?.max_salary || 0} ${job?.salary?.currency || ''}`} />
                    <InfoItem icon={<FaClock />} label={job?.employmentType || ""} />
                    <InfoItem icon={<FaGraduationCap />} label={job?.experienceLevel || ""} />
                    <InfoItem icon={<FaCalendarAlt />} label={`Posted: ${formatDate(job?.createdAt)}`} />
                    <InfoItem icon={<FaCalendarAlt />} label={`Deadline: ${formatDate(job?.applicationDeadline)}`} />
                    <InfoItem icon={<FaUsers />} label={`Openings: ${job?.openings}`} />
                </div>

                <Section title="Skills">
                    <div className="flex flex-wrap gap-2">
                        {parsedSkills.map((skill, i) => (
                            <span key={i} className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full">
                                <FaTag className="text-gray-600 dark:text-gray-300" />
                                {skill}
                            </span>
                        ))}
                    </div>
                </Section>

                {suggestedSkills.length > 0 && (
                    <Section title="Suggested Skills">
                        <div className="flex flex-wrap gap-2">
                            {suggestedSkills.map((skill, i) => (
                                <span key={i} className="flex items-center gap-1 bg-green-100 dark:bg-green-700 text-sm px-3 py-1 rounded-full">
                                    <FaTag className="text-green-600 dark:text-green-300" />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                <Section title="Job Description">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job?.description}</p>
                </Section>

                {job?.Requirements && (
                    <Section title="Requirements">
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            {job.Requirements
                                .split(/(?<=[.?!])\s+(?=[A-Z])/)
                                .filter((line) => line.trim().length > 0)
                                .map((sentence, idx) => (
                                    <li key={idx}>{sentence.trim()}</li>
                                ))}
                        </ul>
                    </Section>
                )}

                {showApplyForm && (
                    <div className="mt-12 pt-8 border-t dark:border-gray-700">
                        <ApplyForm
                            jobId={job?._id || ""}
                            jobTitle={job?.title || ""}
                            companyName={job?.company?.companyInfo?.companyName || ""}
                            companyLogo={job?.company?.avatar?.avatar_Url}
                            onBack={() => setShowApplyForm(false)}
                            currency={job?.salary?.currency || "USD"}
                        />
                    </div>
                )}
            </div>

            {/* Suggested Jobs Outside Main Box */}
            {suggestedJobs.length > 0 && (
                <Section title="Suggested Jobs">
                    <div className="grid gap-4 m-5 md:grid-cols-2 lg:grid-cols-3">
                        {suggestedJobs.map((job) => {
                            const appliedInAppliedJobs = userData && user?.jobSeekerInfo?.appliedJobs?.some(
                                (e) => e?.jobId === job?._id && e?.isApplied === true
                            ) || false;

                            const appliedInSavedJobs = userData && user?.jobSeekerInfo?.savedJobs?.some(
                                (e) => e?.jobId === job?._id && e?.isApplied === true
                            ) || false;

                            const isApplied = appliedInAppliedJobs || appliedInSavedJobs;

                            return (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isApplied={isApplied}
                                />
                            );
                        })}
                    </div>
                </Section>
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
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 ml-4">{title}</h3>
        {children}
    </div>
);

export default JobDetails;
