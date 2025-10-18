import React, { useContext, useState } from "react";
import { FaCloudUploadAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, FaDollarSign, } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Context } from "../../../Context/context";

// props come from job detail page
const JobApplyForm = ({ jobId, jobTitle, companyName, companyLogo, onBack, currency, }) => {
    const { userData, Jobs, JobsAction, showAlert } = useContext(Context);
    const { setAppliedJobIds } = JobsAction
    const { applyJob } = Jobs
    const existingResume = userData?.jobSeekerInfo?.resumeUrl || null;

    const [formData, setFormData] = useState({
        expectedSalary: "",
        coverLetter: "",
        resume: null,
        resumeChanged: false,
        existResume: ""
    });

    const [showPreview, setShowPreview] = useState(false);
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleResumeChange = (file) => {
        setFormData((prev) => ({
            ...prev,
            resume: file,
            resumeChanged: true,
        }));
        setShowPreview(false);
        setErrors((prev) => ({ ...prev, resume: undefined }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.resume && !existingResume?.resume_Url)
            newErrors.resume = "Resume is required.";
        if (formData.coverLetter.trim().length < 50)
            newErrors.coverLetter = "Cover letter must be at least 50 characters.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const formdata = {
                jobId,
                expectedSalary: formData.expectedSalary,
                currency,
                coverLetter: formData.coverLetter,
                resume: formData.resumeChanged ? formData.resume : "",
                existResume: existingResume?.resume_Url,
            };
            const res = await applyJob({ formdata });
            showAlert(res)
            if (res.statusCode === 200) {
                setAppliedJobIds((prev) => [...prev, jobId]);
                setStatus("success");
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus("error");
        } finally {
            setIsLoading(false);
            setFormData({
                expectedSalary: "",
                coverLetter: "",
                resume: null,
                resumeChanged: false,
            });
            setShowPreview(false);
            onBack()
        }
    };

    return (
        <div className="bg-white m-3 text-gray-900 rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="rounded-full p-2 hover:bg-gray-100"
                >
                    <FaX className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold ml-4">Apply for this Job</h2>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-100 rounded-md border border-gray-200">
                <img
                    src={companyLogo || "/placeholder.svg"}
                    alt="logo"
                    width={64}
                    height={64}
                    className="rounded-full border border-gray-300 bg-white p-1"
                />
                <div>
                    <h3 className="text-xl font-semibold text-blue-600">
                        {jobTitle}
                    </h3>
                    <p className="text-gray-600">{companyName}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Expected Salary */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Expected Salary ({currency}) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Enter your expected salary in ${currency}`}
                            value={formData.expectedSalary}
                            onChange={(e) => handleChange("expectedSalary", e.target.value)}
                            className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.expectedSalary
                                ? "border-red-500"
                                : "border-gray-300"
                                } bg-gray-100 text-sm text-gray-900`}
                        />
                    </div>
                    {errors.expectedSalary && (
                        <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>
                    )}
                </div>

                {/* Resume Upload or Preview */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Resume <span className="text-red-500">*</span>
                    </label>

                    {existingResume?.resume_Url && !formData.resumeChanged ? (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50/30">
                                <span className="text-sm truncate">
                                    {existingResume.file_name}
                                </span>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview((prev) => !prev)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {showPreview ? "Hide Preview" : "Preview"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                resumeChanged: true,
                                                resume: null,
                                            }))
                                        }
                                        className="text-sm text-yellow-600 hover:underline"
                                    >
                                        Change Resume
                                    </button>
                                </div>
                            </div>
                            {showPreview && (
                                <div className="mt-4">
                                    <iframe
                                        src={existingResume.resume_Url}
                                        className="w-full h-[500px] border border-gray-300 rounded"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {formData.resume && (
                                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2">
                                    <span className="text-sm truncate">{formData.resume.name}</span>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview((prev) => !prev)}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {showPreview ? "Hide Preview" : "Preview"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    resume: null,
                                                    resumeChanged: false,
                                                }))
                                            }
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!formData.resume && (
                                <div className="relative border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleResumeChange(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 mb-2" />
                                    <p className="text-sm">
                                        Click or drag your resume file here
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF, DOC, DOCX up to 5MB
                                    </p>
                                </div>
                            )}

                            {showPreview && formData.resume && (
                                <div className="mt-4">
                                    <iframe
                                        src={URL.createObjectURL(formData.resume)}
                                        className="w-full h-[500px] border border-gray-300 rounded"
                                    />
                                </div>
                            )}

                            {errors.resume && (
                                <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
                            )}
                        </>
                    )}
                </div>

                {/* Cover Letter */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                            rows={6}
                            value={formData.coverLetter}
                            onChange={(e) => handleChange("coverLetter", e.target.value)}
                            placeholder="Tell us why you're a great fit for this role..."
                            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.coverLetter && (
                        <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
                >
                    {isLoading ? "Submitting..." : "Submit Application"}
                </button>

                {/* Alerts */}
                {status === "success" && (
                    <Alert type="success" message="Application submitted successfully!" />
                )}
                {status === "error" && (
                    <Alert
                        type="error"
                        message="Failed to submit application. Please try again."
                    />
                )}
            </form>
        </div>
    );
};

const Alert = ({ message, type }) => {
    const color =
        type === "success"
            ? "green"
            : type === "error"
                ? "red"
                : "gray";
    return (
        <div
            className={`flex items-center gap-2 text-${color}-700 bg-${color}-100 p-3 rounded-md mt-4`}
        >
            {type === "success" && <FaCheckCircle className="text-green-600" />}
            {type === "error" && <FaTimesCircle className="text-red-600" />}
            <span>{message}</span>
        </div>
    );
};

export default JobApplyForm;
