import React, { useState, useEffect, useContext } from "react";
import { FiX } from "react-icons/fi";
import CurrencyDropdown from "./currencyDropDown.jsx";
import SelectSkills from "../shared/selectSkills.jsx";
import { Context } from "../../../../Context/context.jsx";

const EditJobs = ({ job, onClose, onUpdate }) => {
    const { Jobs, showAlert } = useContext(Context)
    const { editJob } = Jobs;

    const formatJobData = (job) => ({
        jobId: job._id,
        title: job.title || "",
        location: job.location || "",
        employmentType: job.employmentType || "",
        salary: {
            min_salary: job.salary?.min_salary || 0,
            max_salary: job.salary?.max_salary || 0,
            currency: job.salary?.currency || "USD",
        },
        description: job.description || "",
        status: job.status || "Active",
        experienceLevel: job.experienceLevel || "",
        openings: job.openings || 1,
        applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline).toISOString().split("T")[0]
            : "",
        isRemote: job.isRemote || false,
        Requirements: job.Requirements || "",
        skillsRequired: job.skillsRequired || [],
    });
    const [formData, setFormData] = useState(formatJobData(job));

    useEffect(() => {
        setFormData(formatJobData(job));
    }, [job]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            salary: {
                ...prev.salary,
                [name]: name === "currency" ? value : parseInt(value) || 0,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedJob = {
                ...formData,
                salary: {
                    currency: formData.salary.currency,
                    min_salary: formData.salary.min_salary,
                    max_salary: formData.salary.max_salary,
                },
            };

            const data = await editJob({ updatedJob });
            showAlert(data)
            if (data.statusCode === 200) {
                onUpdate(data?.data)
            }
        } catch (error) {
            console.log("Error of edit the job", error.message)
        } finally {
            onClose()
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up transform scale-95 transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Close"
                >
                    <FiX className="w-6 h-6" />
                </button>

                <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Edit Job Posting
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side */}
                        <div className="space-y-4">
                            {/* Job Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Job Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    disabled={formData.isRemote}
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full disabled:cursor-not-allowed disabled:bg-amber-50 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Employment Type */}
                            <div>
                                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Employment Type
                                </label>
                                <select
                                    id="employmentType"
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select type</option>
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            {/* Salary */}
                            <div className="grid grid-cols-2 gap-4">
                                <CurrencyDropdown value={formData.salary.currency} onChange={handleSalaryChange} />
                                <div>
                                    <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Min Salary
                                    </label>
                                    <input
                                        id="min_salary"
                                        name="min_salary"
                                        type="number"
                                        value={formData.salary.min_salary}
                                        onChange={handleSalaryChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Max Salary
                                    </label>
                                    <input
                                        id="max_salary"
                                        name="max_salary"
                                        type="number"
                                        value={formData.salary.max_salary}
                                        onChange={handleSalaryChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Experience */}
                            <div>
                                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Experience Level
                                </label>
                                <select
                                    id="experienceLevel"
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select level</option>
                                    <option value="Entry">Entry</option>
                                    <option value="Mid">Mid</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Lead">Lead</option>
                                </select>
                            </div>

                            {/* Openings & Deadline */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="openings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Openings
                                    </label>
                                    <input
                                        id="openings"
                                        name="openings"
                                        type="number"
                                        value={formData.openings}
                                        onChange={handleNumberChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Deadline
                                    </label>
                                    <input
                                        id="applicationDeadline"
                                        name="applicationDeadline"
                                        type="date"
                                        value={formData.applicationDeadline}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Remote Checkbox */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isRemote"
                                    name="isRemote"
                                    checked={formData.isRemote}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="isRemote" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Is Remote Job
                                </label>
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pause">Paused</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="space-y-4">
                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Job Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[150px]"
                                />
                            </div>

                            {/* Requirements */}
                            <div>
                                <label htmlFor="Requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Requirements
                                </label>
                                <textarea
                                    id="Requirements"
                                    name="Requirements"
                                    value={formData.Requirements}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[120px]"
                                />
                            </div>

                            {/* Skills */}
                            <SelectSkills
                                userSkills={formData.skillsRequired}
                                setUserSkills={(skills) =>
                                    setFormData((prev) => ({ ...prev, skillsRequired: skills }))
                                }
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJobs;
