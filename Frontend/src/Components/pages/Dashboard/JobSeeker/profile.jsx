import { useContext, useState, useRef } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiUpload, FiFileText, FiX, FiLoader, FiSave, FiCalendar } from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx"
import { useNavigate } from "react-router-dom"
import SelectSkills from "../shared/selectSkills.jsx"

const JobSeekerProfile = () => {
  const navigate = useNavigate()
  const { userAuth, userData, userImage, userProfile, } = useContext(Context)
  const { setIsEditProfile } = userProfile
  const { updateAvatar, editProfile, update_Edu_Exp, update_skills_resume, downloadResume } = userAuth;
  const { image, setImage } = userImage
  const user = userData;
  const [isLoading, setLoading] = useState(false);
  // personal info
  const [userInfo, setUserInfo] = useState({
    fullName: user?.jobSeekerInfo?.fullName || "",
    email: user?.email || "",
    userName: user?.userName,
    bio: user?.jobSeekerInfo?.bio,
    socialLinks: {
      facebook: user?.jobSeekerInfo?.socialLinks?.facebook || "",
      linkedin: user?.jobSeekerInfo?.socialLinks?.linkedin || "",
      twitter: user?.jobSeekerInfo?.socialLinks?.twitter || "",
      instagram: user?.jobSeekerInfo?.socialLinks?.instagram || "",
      github: user?.jobSeekerInfo?.socialLinks?.github || "",
    }
  })
  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setUserInfo((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setUserInfo((prev) => ({ ...prev, [field]: value }));
    }
  };

  // eduaction and experience
  const [edu_exp, setEdu_exp] = useState({
    Institute: user?.jobSeekerInfo?.eduaction?.Institute || "",
    degree: user?.jobSeekerInfo?.eduaction?.degree || "",
    fieldOfStudy: user?.jobSeekerInfo?.eduaction?.fieldOfStudy || "",
    startYear: user?.jobSeekerInfo?.eduaction?.startYear || "",
    endYear: user?.jobSeekerInfo?.eduaction?.endYear || "",
    // exp
    jobTitle: user?.jobSeekerInfo?.experience?.jobTitle || "",
    companyName: user?.jobSeekerInfo?.experience?.companyName || "",
    employmentType: user?.jobSeekerInfo?.experience?.employmentType || "",
    location: user?.jobSeekerInfo?.experience?.location || "",
    startDate: user?.jobSeekerInfo?.experience?.startDate || "",
    endDate: user?.jobSeekerInfo?.experience?.endDate,
    current: user?.jobSeekerInfo?.experience?.current || "",
    description: user?.jobSeekerInfo?.experience?.description || "",
  })

  const handleInfoChange = (field, value) => {
    setEdu_exp((prev) => ({ ...prev, [field]: value }))
  }

  const formatDateInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // "2024-12-04T..." → "2024-12-04"
  };

  // update edu and exp
  const handle_Edu_Exp = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const data = await update_Edu_Exp(edu_exp)
    } catch (error) {
      console.log("Error updating profile:", error.message)
    } finally {
      setLoading(false)
    }
  }

  // update profile
  const handleSumbit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const userData = userInfo
      const data = await editProfile({ userData, navigate })
      if (data.statusCode === 201) {
        setIsEditProfile(true)
      }
    }
    catch (error) {
      console.log("Error updating profile:", error.message)
    } finally {
      setLoading(false)
    }
  }

  // update avatar
  const fileInputRef = useRef();
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      setLoading(true)
      if (!file) {
        console.log("File is required",);
      }
      const data = await updateAvatar(file)
      setImage(data.data)
      setLoading(false)
    } catch (error) {
      console.log("upload image", error.message)
    } finally {
      setLoading(false)
    }
  };


  // skills and resume 
  const [skills,setSkills] = useState(user?.jobSeekerInfo?.skills || [])
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(user?.jobSeekerInfo?.resumeUrl?.resume_Url || "");
  const [showPreview, setShowPreview] = useState(false);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeUrl("")
    }
  };

  // update resume and skills
  const handle_resume_skills = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await update_skills_resume({ skills, resumeFile })
      setResumeUrl(data.data.resumeUrl)
      setSkills(data.data.Skills)
    } catch (error) {
      console.log("Error updating profile:", error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Information */}
        <DashboardCard title="Personal Information">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                {userData?.avatar?.avatar_Url ? (
                  <img
                    src={image || userData.avatar.avatar_Url}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-300">{userData?.companyInfo?.companyName?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <button type="button" onClick={handleButtonClick}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiUpload className="w-4 h-4" />
                  <span>{isLoading ? <FiLoader className="animate-spin h-6 w-6 text-blue-500" /> : "Upload Logo"}</span>
                </button>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            <form action="" onSubmit={handleSumbit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="user"
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    value={userInfo.fullName || ""}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="example123@gmail.com"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    value={userInfo.email || ""}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">userName</label>
                  <input
                    type="userName"
                    placeholder="user_123"
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    value={userInfo.userName || ""}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea name="bio" id="bio"
                    value={userInfo.bio || ""}
                    placeholder="e.g. Passionate frontend developer with 3+ years of experience"
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    rows={4}
                    minLength={50}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://facebook.com"
                    value={userInfo.socialLinks.facebook || ""}
                    onChange={(e) => handleInputChange("facebook", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linkedin Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://linkedin.com"
                    value={userInfo.socialLinks.linkedin || ""}
                    onChange={(e) => handleInputChange("linkedin", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://instagram.com"
                    value={userInfo.socialLinks.instagram || ""}
                    onChange={(e) => handleInputChange("instagram", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://twitter.com"
                    value={userInfo.socialLinks.twitter || ""}
                    onChange={(e) => handleInputChange("twitter", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Github Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://github.com"
                    value={userInfo.socialLinks.github || ""}
                    onChange={(e) => handleInputChange("github", e.target.value, "socialLinks")}
                  />
                </div>
              </div>

              <button type="sumbit" className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiSave className="w-4 h-4" />
                <span>{isLoading ? <FiLoader className="animate-spin h-6 w-6 text-blue-500" /> : "Save Info"}</span>
              </button>
            </form>
          </div>
        </DashboardCard>

        {/* edu and exp Management */}
        <DashboardCard title="Other Information">
          <form onSubmit={handle_Edu_Exp}>
            <div className="grid grid-cols-1 gap-4">
              {/* edu management  */}
              <DashboardCard title="Eduaction">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Degree/Qualification *</label>
                    <input
                      type="text"
                      value={edu_exp.degree || ""}
                      onChange={(e) => handleInfoChange("degree", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Bachelor of Science in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Field of Study *</label>
                    <input
                      type="text"
                      value={edu_exp.fieldOfStudy || ""}
                      onChange={(e) => handleInfoChange("fieldOfStudy", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Bachelor of Science in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Institution *</label>
                    <input
                      type="text"
                      value={edu_exp.Institute || ""}
                      onChange={(e) => handleInfoChange("Institute", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Bachelor of Science in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <FiCalendar className="inline mr-1" /> Start Year *
                    </label>
                    <input
                      type="date"
                      value={formatDateInput(edu_exp.startYear) || ""}
                      onChange={(e) => handleInfoChange("startYear", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <FiCalendar className="inline mr-1" /> End Year *
                    </label>
                    <input
                      type="date"
                      value={formatDateInput(edu_exp.endYear) || ""}
                      onChange={(e) => handleInfoChange("endYear", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                </div>
              </DashboardCard>

              {/* exp mangament  */}
              <DashboardCard title="Experience">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={edu_exp.jobTitle}
                      onChange={(e) => handleInfoChange("jobTitle", e.target.value)}
                      placeholder="e.g. Software Engineer"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Company *</label>
                    <input
                      type="text"
                      value={edu_exp.companyName}
                      onChange={(e) => handleInfoChange("companyName", e.target.value)}
                      placeholder="e.g. TechCorp"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Employment Type *</label>
                    <input
                      type="text"
                      value={edu_exp.employmentType}
                      onChange={(e) => handleInfoChange("employmentType", e.target.value)}
                      placeholder="Full-time / Internship"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Location *</label>
                    <input
                      type="text"
                      value={edu_exp.location}
                      onChange={(e) => handleInfoChange("location", e.target.value)}
                      placeholder="e.g. Karachi, Pakistan"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-1">
                      <FiCalendar /> Start Date *
                    </label>
                    <input
                      type="date"
                      value={formatDateInput(edu_exp.startDate)}
                      onChange={(e) => handleInfoChange("startDate", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-1">
                      <FiCalendar /> End Date *
                    </label>
                    <input
                      type="date"
                      value={formatDateInput(edu_exp.endDate)}
                      onChange={(e) => handleInfoChange("endDate", e.target.value)}
                      disabled={edu_exp.current}
                      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${edu_exp.current ? "opacity-50" : ""}`}
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <input
                        type="checkbox"
                        checked={edu_exp.current}
                        onChange={(e) => handleInfoChange("current", e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      I currently work here
                    </label>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
                    <textarea
                      rows="4"
                      value={edu_exp.description}
                      onChange={(e) => handleInfoChange("description", e.target.value)}
                      placeholder="Describe your role, achievements, and responsibilities..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </DashboardCard>
              <button type="sumbit" className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiSave className="w-4 h-4" />
                <span>{isLoading ? <FiLoader className="animate-spin h-6 w-6 text-blue-500" /> : "Save Edu&Exp"}</span>
              </button>
            </div>
          </form>
        </DashboardCard>
      </div>

      {/* Skills Management */}
      <form action="" onSubmit={handle_resume_skills}>
        <div className="grid gap-4">
          <SelectSkills bio = {userInfo?.bio || ""} userSkills={skills}/>

          <DashboardCard title="Resume Management">
            <div className="space-y-4">
              {/* Resume Upload */}
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Drop a new resume here or <span className="text-blue-600">browse files</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                </div>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeChange}
              />

              {/* Resume Display */}

              {(resumeFile || resumeUrl) && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {resumeFile ? resumeFile?.name : user?.jobSeekerInfo?.resumeUrl?.file_name || "Uploaded Resume "}
                    <span className="ml-4">
                      {resumeFile ? resumeFile?.size / 1024 + "Kb" : user?.jobSeekerInfo?.resumeUrl?.size || ""}
                    </span>
                  </p>
                  <div className="flex space-x-2 justify-center">
                    {resumeUrl && (
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Preview
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Resume Preview Modal */}
            {showPreview && resumeUrl && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full relative">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FiX size={20} />
                  </button>
                  <iframe
                    src={resumeUrl}
                    title="Resume Preview"
                    className="w-full h-[600px] rounded border"
                    allow="fullscreen"
                    frameBorder="0"
                  />
                </div>
              </div>
            )}
          </DashboardCard>
          <button type="sumbit" className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiSave className="w-4 h-4" />
            <span>{isLoading ? <FiLoader className="animate-spin h-6 w-6 text-blue-500" /> : "Update Resume and Skills"}</span>
          </button>
        </div>
      </form>


    </div>
  )
}

export default JobSeekerProfile