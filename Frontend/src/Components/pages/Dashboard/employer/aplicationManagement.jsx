// import React, { useContext, useState } from "react"
// import { FaSearch, FaDownload, FaCheck, FaEye, FaUsers, FaArrowLeft, FaClock } from "react-icons/fa"
// import { FiMessageCircle, FiX } from "react-icons/fi"
// import { Context } from "../../../../Context/context.jsx"
// import { useChat } from "../../../../Context/chatContext.jsx"

// const ApplicantManagement = ({ jobData, setActiveTab }) => {
//   const { Jobs, showAlert } = useContext(Context)
//   const { changeApplicationStatus } = Jobs
//   const [status, setStatus] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [selectedApplicant, setSelectedApplicant] = useState(null)
//   const [selectedJob, setSelectedJob] = useState(null)

//   // start the chat 
//   const { createChat } = useChat();

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "New":
//         return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
//       case "Shortlisted":
//         return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
//       case "Hired":
//         return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
//       case "Interview":
//         return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300"
//       case "Rejected":
//         return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
//       default:
//         return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300"
//     }
//   }

//   // change status
//   const handleStatusChange = async (jobId, applicationId, status) => {
//     try {
//       const Data = { jobId, applicationId, status }
//       const data = await changeApplicationStatus({ Data })
//       showAlert(data)
//       if (data.statusCode === 200) {
//         setStatus(status)
//       }
//     } catch (error) {
//       console.log("Error during change the status", error.message)
//     }
//   }

//   // get exp years 
//   const getExperienceYears = (startDate, endDate) => {
//     if (!startDate) return 0;

//     const start = new Date(startDate);
//     const end = new Date(endDate || Date.now()); // If endDate is falsy, use current date

//     if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

//     const diffInMilliseconds = end - start;
//     const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

//     const expYears = Math.floor(diffInYears)
//     return expYears + " Year";
//   };

//   // get download resume url
//   const getDownloadableResumeUrl = (url) => {
//     if (!url || typeof url !== "string") return "#";

//     try {
//       const urlObj = new URL(url);
//       const parts = urlObj.pathname.split("/");

//       // Insert `fl_attachment` after `/upload`
//       const uploadIndex = parts.findIndex((part) => part === "upload");
//       if (uploadIndex !== -1 && !parts[uploadIndex + 1]?.startsWith("fl_attachment")) {
//         parts.splice(uploadIndex + 1, 0, "fl_attachment");
//         urlObj.pathname = parts.join("/");
//       }

//       return urlObj.toString();
//     } catch (error) {
//       console.error("Invalid URL:", url);
//       return "#";
//     }
//   };

//   // Filter applicants based on selected job, search term, and status filter
//   const currentFilteredApplicants = selectedJob?.applicants.filter((e) => {
//     const matchesSearch =
//       e?.User?.jobSeekerInfo?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
//       e?.User?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
//     const matchesStatus = statusFilter === "all" || e?.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   // create chat fun
//   const handleChat = (jobId, applicationId, receiverId) => {
//     createChat({ jobId, applicationId, receiverId })
//     setActiveTab("messages")
//   }

//   return (
//     <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       {selectedJob ? (
//         // Display Applicants for a specific job
//         <>
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//             <button
//               onClick={() => {
//                 setSelectedJob(null)
//                 setSearchTerm("")
//                 setStatusFilter("all")
//               }}
//               className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
//             >
//               <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span className="font-medium">Back to Job Openings</span>
//             </button>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left flex-1">
//               Applicants for {selectedJob.title}
//             </h1>
//             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
//               {currentFilteredApplicants.length} applicants
//             </span>
//           </div>

//           {/* Filters for applicants */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search applicants..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
//                 />
//               </div>
//               <div className="flex space-x-2 sm:space-x-4">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="New">New</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Shortlisted">Shortlisted</option>
//                   <option value="Rejected">Rejected</option>
//                   <option value="Interview">Interview</option>
//                   <option value="Hired">Hired</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Applicants Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {currentFilteredApplicants.map((e) => (
//               <div
//                 key={e?._id}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="space-y-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src={e?.User?.avatar?.avatar_Url || "/placeholder.svg?height=40&width=40"}
//                         className="w-12 h-12 rounded-full object-cover"
//                       />
//                       <div>
//                         <h3 className="font-semibold text-gray-900 dark:text-white">{e?.User?.jobSeekerInfo?.fullName || ""}</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">{e?.User?.email || ""}</p>
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status || e?.status)}`}>
//                       {status || e?.status}
//                     </span>
//                   </div>
//                   <div className="space-y-2">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Applied for:</p>
//                       <p className="text-sm text-blue-600 dark:text-blue-400">{selectedJob?.title || ""}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Experience:</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">{getExperienceYears(e?.User?.jobSeekerInfo?.experience?.startDate, e?.User?.jobSeekerInfo?.experience?.endDate) || "0 Year"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Applied:</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         {new Date(e?.appliedAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills:</p>
//                     <div className="flex flex-wrap gap-1">
//                       {e?.User?.jobSeekerInfo?.skills?.map((skill) => (
//                         <span
//                           key={skill}
//                           className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => setSelectedApplicant(e)}
//                       className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                     >
//                       <FaEye className="w-4 h-4" />
//                       <span>View</span>
//                     </button>
//                     <button onClick={() => handleChat(selectedJob?._id, e?._id, e?.User?._id)}
//                       className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                       <FiMessageCircle className="w-4 h-4" />
//                     </button>
//                     <a
//                       href={getDownloadableResumeUrl(e?.resumeUrl?.resume_Url)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
//                       title="Download Resume"
//                     >
//                       <FaDownload className="w-4 h-4" />
//                     </a>

//                   </div>
//                   {e?.status === "Hired" || status === "Hired" ?
//                     <button disabled={true}
//                       className="flex-1 flex items-center disabled:cursor-not-allowed justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
//                     >
//                       <FaCheck className="w-3 h-3" />
//                       <span>You are Hired</span>
//                     </button> : (
//                       <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
//                         <button
//                           onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Pending")}
//                           className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
//                         >
//                           <FaClock className="w-3 h-3" />
//                           <span>Pending</span>
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Shortlisted")}
//                           className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
//                         >
//                           <FaCheck className="w-3 h-3" />
//                           <span>Shortlist</span>
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Rejected")}
//                           className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs min-w-[100px]"
//                         >
//                           <FiX className="w-3 h-3" />
//                           <span>Reject</span>
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Interview")}
//                           className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs min-w-[100px]"
//                         >
//                           <FiMessageCircle className="w-3 h-3" />
//                           <span>Interview</span>
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Hired")}
//                           className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
//                         >
//                           <FaCheck className="w-3 h-3" />
//                           <span>Hired</span>
//                         </button>
//                       </div>
//                     )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {currentFilteredApplicants.length === 0 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
//               <div className="text-center py-8">
//                 <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants found</h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   No applicants match your current filters for this job.
//                 </p>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         // Display Job Openings Table
//         <>
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Openings</h1>
//             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
//               {jobData?.length || 0} jobs
//             </span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {jobData.map((job) => (
//               <div
//                 key={job?._id}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job?.title || ""}</h3>
//                   <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
//                     {job?.openings || 0} openings
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{job?.description || ""}</p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
//                     <FaUsers className="w-4 h-4" />
//                     <span className="text-sm">{job?.applicants?.length || 0} applicants</span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedJob(job)}
//                     className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                   >
//                     <FaEye className="w-4 h-4" />
//                     <span>View Applicants</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Applicant Detail Modal */}
//       {selectedApplicant && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={selectedApplicant?.User?.avatar?.avatar_Url || "/placeholder.svg?height=40&width=40"}
//                     alt={selectedApplicant.name}
//                     className="w-16 h-16 rounded-full object-cover"
//                   />
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedApplicant?.User?.jobSeekerInfo?.fullName || ""}</h2>
//                     <p className="text-gray-600 dark:text-gray-400">{selectedApplicant?.User?.email || ""}</p>
//                     <span
//                       className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(status || selectedApplicant.status)}`}
//                     >
//                       {status || selectedApplicant.status}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedApplicant(null)}
//                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                 >
//                   <FiX className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Application Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-600 dark:text-gray-400">Position:</p>
//                       <p className="font-medium text-gray-900 dark:text-white">{selectedJob?.title || ""}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 dark:text-gray-400">Experience:</p>
//                       <p className="font-medium text-gray-900 dark:text-white">{getExperienceYears(selectedApplicant?.User?.jobSeekerInfo?.experience?.startDate, selectedApplicant?.User?.jobSeekerInfo?.experience?.endDate) || "0 Year"}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 dark:text-gray-400">Applied Date:</p>
//                       <p className="font-medium text-gray-900 dark:text-white">
//                         {new Date(selectedApplicant?.appliedAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 dark:text-gray-400">Status:</p>
//                       <p className="font-medium text-gray-900 dark:text-white">{status || selectedApplicant?.status || ""}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedApplicant?.User?.jobSeekerInfo?.skills.map((skill) => (
//                       <span
//                         key={skill}
//                         className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//                   <a
//                     href={getDownloadableResumeUrl(selectedApplicant?.resumeUrl?.resume_Url)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <FaDownload className="w-4 h-4" />
//                     <span>Download Resume</span>
//                   </a>
//                   <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                     <FiMessageCircle className="w-4 h-4" />
//                     <span>Send Message</span>
//                   </button>
//                 </div>
//                 {selectedApplicant?.status === "Hired" || status === "Hired" ?
//                   <button disabled={true}
//                     className="flex-1 flex items-center disabled:cursor-not-allowed justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
//                   >
//                     <FaCheck className="w-3 h-3" />
//                     <span>You are Hired</span>
//                   </button> : (
//                     <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
//                       <button
//                         onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Pending")}
//                         className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
//                       >
//                         <FaClock className="w-3 h-3" />
//                         <span>Pending</span>
//                       </button>
//                       <button
//                         onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Shortlisted")}
//                         className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
//                       >
//                         <FaCheck className="w-3 h-3" />
//                         <span>Shortlist</span>
//                       </button>
//                       <button
//                         onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Rejected")}
//                         className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs min-w-[100px]"
//                       >
//                         <FiX className="w-3 h-3" />
//                         <span>Reject</span>
//                       </button>
//                       <button
//                         onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Interview")}
//                         className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs min-w-[100px]"
//                       >
//                         <FiMessageCircle className="w-3 h-3" />
//                         <span>Interview</span>
//                       </button>
//                       <button
//                         onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Hired")}
//                         className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
//                       >
//                         <FaCheck className="w-3 h-3" />
//                         <span>Hired</span>
//                       </button>
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ApplicantManagement


import React, { useContext, useState } from "react"
import { FaSearch, FaDownload, FaCheck, FaEye, FaUsers, FaArrowLeft, FaClock } from "react-icons/fa"
import { FiMessageCircle, FiX } from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx"
import { useChat } from "../../../../Context/chatContext.jsx"

const ApplicantManagement = ({ jobData, setActiveTab }) => {
  const { Jobs, showAlert } = useContext(Context)
  const { changeApplicationStatus } = Jobs
  const [status, setStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  // start the chat 
  const { createChat } = useChat();

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
      case "Shortlisted":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
      case "Hired":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
      case "Interview":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300"
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300"
    }
  }

  // change status
  const handleStatusChange = async (jobId, applicationId, status) => {
    try {
      const Data = { jobId, applicationId, status }
      const data = await changeApplicationStatus({ Data })
      showAlert(data)
      if (data.statusCode === 200) {
        setStatus(status)
      }
    } catch (error) {
      console.log("Error during change the status", error.message)
    }
  }

  // get exp years 
  const getExperienceYears = (startDate, endDate) => {
    if (!startDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate || Date.now()); // If endDate is falsy, use current date

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffInMilliseconds = end - start;
    const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    const expYears = Math.floor(diffInYears)
    return expYears + " Year";
  };

  // get download resume url
  const getDownloadableResumeUrl = (url) => {
    if (!url || typeof url !== "string") return "#";

    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/");

      // Insert `fl_attachment` after `/upload`
      const uploadIndex = parts.findIndex((part) => part === "upload");
      if (uploadIndex !== -1 && !parts[uploadIndex + 1]?.startsWith("fl_attachment")) {
        parts.splice(uploadIndex + 1, 0, "fl_attachment");
        urlObj.pathname = parts.join("/");
      }

      return urlObj.toString();
    } catch (error) {
      console.error("Invalid URL:", url);
      return "#";
    }
  };

  // Filter applicants based on selected job, search term, and status filter
  const currentFilteredApplicants = selectedJob?.applicants.filter((e) => {
    const matchesSearch =
      e?.User?.jobSeekerInfo?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      e?.User?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    const matchesStatus = statusFilter === "all" || e?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // create chat fun
  const handleChat = (jobId, applicationId, receiverId) => {
    createChat({ jobId, applicationId, receiverId })
    setActiveTab("messages")
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {selectedJob ? (
        // Display Applicants for a specific job
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <button
              onClick={() => {
                setSelectedJob(null)
                setSearchTerm("")
                setStatusFilter("all")
              }}
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
            >
              <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Back to Job Openings</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left flex-1">
              Applicants for {selectedJob.title}
            </h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
              {currentFilteredApplicants.length} applicants
            </span>
          </div>

          {/* Filters for applicants */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div className="flex space-x-2 sm:space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applicants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentFilteredApplicants.map((e) => (
              <div
                key={e?._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={e?.User?.avatar?.avatar_Url || "/placeholder.svg?height=40&width=40"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{e?.User?.jobSeekerInfo?.fullName || ""}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{e?.User?.email || ""}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status || e?.status)}`}>
                      {status || e?.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Applied for:</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{selectedJob?.title || ""}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Experience:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{getExperienceYears(e?.User?.jobSeekerInfo?.experience?.startDate, e?.User?.jobSeekerInfo?.experience?.endDate) || "0 Year"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Applied:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(e?.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {e?.User?.jobSeekerInfo?.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedApplicant(e)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FaEye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button onClick={() => handleChat(selectedJob?._id, e?._id, e?.User?._id)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <FiMessageCircle className="w-4 h-4" />
                    </button>
                    <a
                      href={getDownloadableResumeUrl(e?.resumeUrl?.resume_Url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                      title="Download Resume"
                    >
                      <FaDownload className="w-4 h-4" />
                    </a>

                  </div>
                  {e?.status === "Hired" || status === "Hired" ?
                    <button disabled={true}
                      className="flex-1 flex items-center disabled:cursor-not-allowed justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
                    >
                      <FaCheck className="w-3 h-3" />
                      <span>You are Hired</span>
                    </button> : (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Pending")}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
                        >
                          <FaClock className="w-3 h-3" />
                          <span>Pending</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Shortlisted")}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
                        >
                          <FaCheck className="w-3 h-3" />
                          <span>Shortlist</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Rejected")}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs min-w-[100px]"
                        >
                          <FiX className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Interview")}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs min-w-[100px]"
                        >
                          <FiMessageCircle className="w-3 h-3" />
                          <span>Interview</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedJob?._id, e?._id, "Hired")}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
                        >
                          <FaCheck className="w-3 h-3" />
                          <span>Hired</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {currentFilteredApplicants.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center py-8">
                <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No applicants match your current filters for this job.
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        // Display Job Openings Table
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Openings</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
              {jobData?.length || 0} jobs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobData.map((job) => (
              <div
                key={job?._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job?.title || ""}</h3>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                    {job?.openings || 0} openings
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{job?.description || ""}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <FaUsers className="w-4 h-4" />
                    <span className="text-sm">{job?.applicants?.length || 0} applicants</span>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FaEye className="w-4 h-4" />
                    <span>View Applicants</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedApplicant?.User?.avatar?.avatar_Url || "/placeholder.svg?height=40&width=40"}
                    alt={selectedApplicant.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedApplicant?.User?.jobSeekerInfo?.fullName || ""}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplicant?.User?.email || ""}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(status || selectedApplicant.status)}`}
                    >
                      {status || selectedApplicant.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Application Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Position:</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedJob?.title || ""}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Experience:</p>
                      <p className="font-medium text-gray-900 dark:text-white">{getExperienceYears(selectedApplicant?.User?.jobSeekerInfo?.experience?.startDate, selectedApplicant?.User?.jobSeekerInfo?.experience?.endDate) || "0 Year"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Applied Date:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedApplicant?.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Status:</p>
                      <p className="font-medium text-gray-900 dark:text-white">{status || selectedApplicant?.status || ""}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant?.User?.jobSeekerInfo?.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <a
                    href={getDownloadableResumeUrl(selectedApplicant?.resumeUrl?.resume_Url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Download Resume</span>
                  </a>
                  <button onClick={() => handleChat(selectedJob?._id, selectedApplicant?._id, selectedApplicant?.User?._id)} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FiMessageCircle className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>
                {selectedApplicant?.status === "Hired" || status === "Hired" ?
                  <button disabled={true}
                    className="flex-1 flex items-center disabled:cursor-not-allowed justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
                  >
                    <FaCheck className="w-3 h-3" />
                    <span>You are Hired</span>
                  </button> : (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Pending")}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
                      >
                        <FaClock className="w-3 h-3" />
                        <span>Pending</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Shortlisted")}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs min-w-[100px]"
                      >
                        <FaCheck className="w-3 h-3" />
                        <span>Shortlist</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Rejected")}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs min-w-[100px]"
                      >
                        <FiX className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Interview")}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs min-w-[100px]"
                      >
                        <FiMessageCircle className="w-3 h-3" />
                        <span>Interview</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedJob?._id, selectedApplicant?._id, "Hired")}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs min-w-[100px]"
                      >
                        <FaCheck className="w-3 h-3" />
                        <span>Hired</span>
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantManagement
