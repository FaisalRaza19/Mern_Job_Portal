import { useContext, useState, useRef } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiUpload, FiFileText, FiPlus, FiX, FiLoader } from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx"

const JobSeekerProfile = () => {
  const { userAuth, userData, userImage } = useContext(Context)
  const { updateAvatar } = userAuth;
  const { image, setImage } = userImage
  const user = userData;
  const [isLoading, setLoading] = useState(false);
  const [skills, setSkills] = useState(["React", "JavaScript", "TypeScript", "Node.js", "Python"])
  const [newSkill, setNewSkill] = useState("")
  const [showAddSkill, setShowAddSkill] = useState(false)

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
      setShowAddSkill(false)
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
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

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.fullName || "User"}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || "example123@gmail.com"}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">userName</label>
                <input
                  type="userName"
                  defaultValue={user?.userName || "user_123"}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </DashboardCard>

        {/* Resume Management */}
        <DashboardCard title="Resume Management">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Resume</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">resume.pdf (2.3 MB)</p>
              <div className="flex space-x-2 justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Preview
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Download
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                Drop a new resume here or <span className="text-blue-600">browse files</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Skills Management */}
      <DashboardCard title="Skills & Expertise">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}

            {showAddSkill ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Enter skill"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={handleAddSkill}
                  className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddSkill(false)
                    setNewSkill("")
                  }}
                  className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddSkill(true)}
                className="flex items-center space-x-1 px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full hover:border-blue-500 transition-colors"
              >
                <FiPlus className="w-3 h-3" />
                <span>Add Skill</span>
              </button>
            )}
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggested Skills</h4>
            <div className="flex flex-wrap gap-2">
              {["CSS", "HTML", "Git", "Docker", "AWS", "MongoDB"].map((skill) => (
                <button
                  key={skill}
                  onClick={() => !skills.includes(skill) && setSkills([...skills, skill])}
                  disabled={skills.includes(skill)}
                  className={`px-2 py-1 text-sm rounded ${skills.includes(skill)
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Professional Summary */}
      <DashboardCard title="Professional Summary">
        <div className="space-y-4">
          <textarea
            rows={6}
            placeholder="Write a brief summary of your professional experience, skills, and career objectives..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            defaultValue="Experienced frontend developer with 5+ years of expertise in React, JavaScript, and modern web technologies. Passionate about creating user-friendly interfaces and optimizing web performance. Seeking opportunities to contribute to innovative projects in a collaborative team environment."
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Summary
          </button>
        </div>
      </DashboardCard>
    </div>
  )
}

export default JobSeekerProfile