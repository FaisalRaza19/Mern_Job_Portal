import React, { useState } from "react"
import { FaCloudUploadAlt, FaUser, FaEnvelope, FaFileAlt, FaCheckCircle, FaTimesCircle,} from "react-icons/fa"
import { FaX } from "react-icons/fa6"

const JobApplyForm = ({ jobId, jobTitle, companyName, companyLogo, onApplySuccess, onBack }) => {
    const [resumeFile, setResumeFile] = useState(null)
    const [coverLetter, setCoverLetter] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [errors, setErrors] = useState({})

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0])
            setErrors((prev) => ({ ...prev, resume: undefined }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!resumeFile) {
            newErrors.resume = "Resume is required."
        }
        if (coverLetter.trim().length < 50) {
            newErrors.coverLetter = "Cover letter must be at least 50 characters."
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus(null)

        if (!validateForm()) return

        setIsLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

            console.log(`Applying for job ${jobId}:`, {
                resumeFileName: resumeFile?.name,
                coverLetter,
                applicantName: "John Doe",
                applicantEmail: "john.doe@example.com",
            })

            setStatus("success")
            onApplySuccess()
            setResumeFile(null)
            setCoverLetter("")
        } catch (error) {
            console.error("Application failed:", error)
            setStatus("error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Go back to job details"
                >
                    <FaX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold ml-4">Apply for this Job</h2>
            </div>

            {/* Job Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-700/30 rounded-md border border-gray-200 dark:border-gray-600">
                <img
                    src={companyLogo || "/placeholder.svg"}
                    alt={`${companyName} logo`}
                    width={64}
                    height={64}
                    className="rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-1"
                />
                <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{jobTitle}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{companyName}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                value="John Doe"
                                readOnly
                                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="email"
                                value="john.doe@example.com"
                                readOnly
                                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Resume Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload Resume <span className="text-red-500">*</span>
                    </label>
                    <div className="relative border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-sm">
                            {resumeFile ? resumeFile.name : "Click or drag your resume file here"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                    {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
                </div>

                {/* Cover Letter */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <FaFileAlt className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                        <textarea
                            rows={6}
                            value={coverLetter}
                            onChange={(e) => {
                                setCoverLetter(e.target.value)
                                setErrors((prev) => ({ ...prev, coverLetter: undefined }))
                            }}
                            placeholder="Tell us why you're a great fit for this role..."
                            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.coverLetter && <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Submitting..." : "Submit Application"}
                </button>

                {/* Feedback */}
                {status === "success" && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 p-3 rounded-md mt-4">
                        <FaCheckCircle className="w-5 h-5" />
                        <span>Application submitted successfully!</span>
                    </div>
                )}
                {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-3 rounded-md mt-4">
                        <FaTimesCircle className="w-5 h-5" />
                        <span>Failed to submit application. Please try again.</span>
                    </div>
                )}
            </form>
        </div>
    )
}

export default JobApplyForm



// import React, { useState } from "react"
// import { FaCloudUploadAlt, FaUser, FaEnvelope, FaFileAlt, FaCheckCircle, FaTimesCircle, FaArrowLeft, } from "react-icons/fa"

// const jobApplyForm = ({ jobId, jobTitle, companyName, companyLogo, onApplySuccess, onBack, }) => {
//     const [resumeFile, setResumeFile] = useState(null)
//     const [coverLetter, setCoverLetter] = useState("")
//     const [isLoading, setIsLoading] = useState(false)
//     const [status, setStatus] = useState(null)
//     const [errors, setErrors] = useState({})

//     const handleFileChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setResumeFile(e.target.files[0])
//             setErrors((prev) => ({ ...prev, resume: undefined }))
//         }
//     }

//     const validateForm = () => {
//         const newErrors = {}
//         if (!resumeFile) {
//             newErrors.resume = "Resume is required."
//         }
//         if (coverLetter.trim().length < 50) {
//             newErrors.coverLetter = "Cover letter must be at least 50 characters."
//         }
//         setErrors(newErrors)
//         return Object.keys(newErrors).length === 0
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setStatus(null)

//         if (!validateForm()) {
//             return
//         }

//         setIsLoading(true)
//         // Simulate API call for application submission
//         try {
//             await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

//             // In a real application, you would send resumeFile and coverLetter to your backend
//             console.log(`Applying for job ${jobId}:`, {
//                 resumeFileName: resumeFile?.name,
//                 coverLetter,
//                 // Simulate pre-filled user info
//                 applicantName: "John Doe",
//                 applicantEmail: "john.doe@example.com",
//             })

//             setStatus("success")
//             onApplySuccess() // Notify parent component of successful application
//             // Optionally clear form or redirect
//             setResumeFile(null)
//             setCoverLetter("")
//         } catch (error) {
//             console.error("Application failed:", error)
//             setStatus("error")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 border border-border">
//             <div className="flex items-center mb-6">
//                 <button
//                     onClick={onBack}
//                     className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0 mr-4"
//                     aria-label="Go back to job details"
//                 >
//                     <FaArrowLeft className="h-5 w-5" /> {/* Changed usage */}
//                 </button>
//                 <h2 className="text-2xl font-bold">Apply for this Job</h2>
//             </div>

//             <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-md border border-border">
//                 <img
//                     src={companyLogo || "/placeholder.svg"}
//                     alt={`${companyName} logo`}
//                     width={64}
//                     height={64}
//                     className="rounded-full border border-border p-1 bg-background"
//                 />
//                 <div>
//                     <h3 className="text-xl font-semibold text-primary">{jobTitle}</h3>
//                     <p className="text-muted-foreground">{companyName}</p>
//                 </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Pre-filled Profile Info (Placeholder) */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
//                             Full Name
//                         </label>
//                         <div className="relative">
//                             <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />{" "}
//                             {/* Changed usage */}
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 value="John Doe" // Placeholder for pre-filled info
//                                 readOnly
//                                 className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
//                             />
//                         </div>
//                     </div>
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
//                             Email Address
//                         </label>
//                         <div className="relative">
//                             <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />{" "}
//                             {/* Changed usage */}
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value="john.doe@example.com" // Placeholder for pre-filled info
//                                 readOnly
//                                 className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Resume Upload */}
//                 <div>
//                     <label htmlFor="resume" className="block text-sm font-medium text-foreground mb-2">
//                         Upload Resume <span className="text-destructive">*</span>
//                     </label>
//                     <div className="relative border border-input rounded-md p-4 flex items-center justify-center flex-col gap-2 cursor-pointer hover:bg-accent/50 transition-colors">
//                         <input
//                             type="file"
//                             id="resume"
//                             name="resume"
//                             accept=".pdf,.doc,.docx"
//                             onChange={handleFileChange}
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                         />
//                         <FaCloudUploadAlt className="w-8 h-8 text-muted-foreground" /> {/* Changed usage */}
//                         <p className="text-sm text-muted-foreground">
//                             {resumeFile ? resumeFile.name : "Drag & drop your resume here, or click to select"}
//                         </p>
//                         <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB</p>
//                     </div>
//                     {errors.resume && <p className="text-destructive text-sm mt-1">{errors.resume}</p>}
//                 </div>

//                 {/* Cover Letter */}
//                 <div>
//                     <label htmlFor="coverLetter" className="block text-sm font-medium text-foreground mb-2">
//                         Cover Letter <span className="text-destructive">*</span>
//                     </label>
//                     <div className="relative">
//                         <FaFileAlt className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /> {/* Changed usage */}
//                         <textarea
//                             id="coverLetter"
//                             name="coverLetter"
//                             rows={6}
//                             placeholder="Tell us why you're a great fit for this role..."
//                             value={coverLetter}
//                             onChange={(e) => {
//                                 setCoverLetter(e.target.value)
//                                 setErrors((prev) => ({ ...prev, coverLetter: undefined }))
//                             }}
//                             className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                         />
//                     </div>
//                     {errors.coverLetter && <p className="text-destructive text-sm mt-1">{errors.coverLetter}</p>}
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 w-full"
//                 >
//                     {isLoading ? "Submitting..." : "Submit Application"}
//                 </button>

//                 {status === "success" && (
//                     <div className="flex items-center gap-2 text-success bg-success/10 p-3 rounded-md mt-4">
//                         <FaCheckCircle className="w-5 h-5" /> {/* Changed usage */}
//                         <span>Application submitted successfully!</span>
//                     </div>
//                 )}
//                 {status === "error" && (
//                     <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md mt-4">
//                         <FaTimesCircle className="w-5 h-5" /> {/* Changed usage */}
//                         <span>Failed to submit application. Please try again.</span>
//                     </div>
//                 )}
//             </form>
//         </div>
//     )
// }

// export default jobApplyForm
