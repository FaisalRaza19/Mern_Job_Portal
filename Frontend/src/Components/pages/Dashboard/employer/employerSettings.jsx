import React, { useContext, useRef, useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiSave, FiTrash2, FiEye, FiEyeOff, FiUpload, FiLoader } from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx"
import { industryOptions } from "../../../../temp/data.js"
import { useNavigate } from "react-router-dom"

const employerSettings = () => {
  const { userData, setUserData, userAuth, userImage, userProfile, showAlert } = useContext(Context);
  const { setIsEditProfile } = userProfile
  const { updateAvatar, editProfile } = userAuth
  const { image, setImage } = userImage
  const user = userData
  const [isLoading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // copmay data
  const [companyData, setCompanyData] = useState({
    email: user?.email || "",
    userName: user?.userName || "",
    companyName: user?.companyInfo?.companyName || "",
    companyType: user?.companyInfo?.companyType || "",
    companySize: user?.companyInfo?.companySize || "",
    companyWeb: user?.companyInfo?.companyWeb || "",
    companyDescription: user?.companyInfo?.companyDescription || "",
    companyLocation: user?.companyInfo?.companyLocation,
    socialLinks: {
      facebook: user?.companyInfo?.socialLinks?.facebook || "",
      linkedin: user?.companyInfo?.socialLinks?.linkedin || "",
      twitter: user?.companyInfo?.socialLinks?.twitter || "",
      instagram: user?.companyInfo?.socialLinks?.instagram || "",
      github: user?.companyInfo?.socialLinks?.github || "",
    },
  })

  const navigate = useNavigate();

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setCompanyData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setCompanyData((prev) => ({ ...prev, [field]: value }));
    }
  };

  //
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    applicationAlerts: true,
    marketingEmails: false,
  })

  const handleDeleteAccount = () => {
    console.log("Account deletion requested")
    setShowDeleteModal(false)
  }

  // handle form submit
  const handleSumbit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const userData = companyData
      const data = await editProfile({ userData, navigate })
      showAlert(data)
      if (data.statusCode === 201) {
        setIsEditProfile(true)
      } else if (data.statusCode === 200) {
        setUserData(data.data)
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
    fileInputRef.current.click(); // Open file picker
  };
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      setLoading(true)
      if (!file) {
        showAlert({ message: "File is required" })
      }
      const data = await updateAvatar(file)
      showAlert(data)
      setImage(data?.data)
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Company Information */}
        <DashboardCard title="Company Information">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                {user?.companyInfo ? (
                  <img
                    src={image || user?.avatar?.avatar_Url}
                    alt="company Avatar"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-300">{user?.companyInfo?.companyName?.charAt(0)?.toUpperCase()}</span>
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
            <form typeof="sumbit" onSubmit={handleSumbit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="text"
                    value={companyData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyData.companyName || ""}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Name</label>
                  <input
                    type="text"
                    value={companyData.userName || ""}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                  <select value={companyData.companyType || ""} onChange={(e) => handleInputChange("companyType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Size</label>
                  <select
                    value={companyData.companySize || ""}
                    onChange={(e) => handleInputChange("companySize", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-500">201–500 employees</option>
                    <option value="501-1000">501–1000 employees</option>
                    <option value="1001-5000">1001–5000 employees</option>
                    <option value="5001-10000">5001–10,000 employees</option>
                    <option value="10001+">10,001+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                  <input
                    type="url"
                    value={companyData.companyWeb || ""}
                    onChange={(e) => handleInputChange("companyWeb", e.target.value)}
                    placeholder="https://www.company.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">company Location</label>
                  <input
                    type="text"
                    value={companyData.companyLocation || ""}
                    onChange={(e) => handleInputChange("companyLocation", e.target.value)}
                    placeholder="e.g New York"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://facebook.com"
                    value={companyData.socialLinks.facebook || ""}
                    onChange={(e) => handleInputChange("facebook", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linkedin Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://linkedin.com"
                    value={companyData.socialLinks.linkedin || ""}
                    onChange={(e) => handleInputChange("linkedin", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://instagram.com"
                    value={companyData.socialLinks.instagram || ""}
                    onChange={(e) => handleInputChange("instagram", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://twitter.com"
                    value={companyData.socialLinks.twitter || ""}
                    onChange={(e) => handleInputChange("twitter", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Github Link</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="https://github.com"
                    value={companyData.socialLinks.github || ""}
                    onChange={(e) => handleInputChange("github", e.target.value, "socialLinks")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={6}
                    value={companyData.companyDescription || ""}
                    onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                    placeholder="Write a brief description of your company, culture, and what makes it a great place to work..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>
              <button type="sumbit" className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiSave className="w-4 h-4" />
                <span>{isLoading ? <FiLoader className="animate-spin h-6 w-6 text-blue-500" /> : "Save Company Info"}</span>
              </button>
            </form>
          </div>

        </DashboardCard>
      </div>

      {/* Notification Preferences */}
      <DashboardCard title="Notification Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications about your job postings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Application Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when someone applies to your jobs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.applicationAlerts}
                onChange={(e) => handleInputChange("applicationAlerts", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about new features and tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingEmails}
                onChange={(e) => handleInputChange("marketingEmails", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FiSave className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </DashboardCard>

      {/* Danger Zone */}
      <DashboardCard title="Danger Zone">
        <div className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              Once you delete your account, there is no going back. All your job postings and data will be permanently
              removed.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose
              all your data, job postings, and applicant information.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default employerSettings
