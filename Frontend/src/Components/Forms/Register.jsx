import React,{ useState } from "react"
import {Link} from "react-router-dom"
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi"
import { FaBuilding, FaArrowLeft } from "react-icons/fa"


const Register = ({ setIsLoggedIn })=>{
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("jobseeker")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "jobseeker",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (userType === "employer" && !formData.company.trim()) {
      newErrors.company = "Company name is required for employers"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    console.log(formData)

    // Simulate API call
    setTimeout(() => {
      if (setIsLoggedIn) {
        setIsLoggedIn(true)
        localStorage.setItem("isLoggedIn", "true")
      }
      setIsLoading(false)
      // In Next.js, you would use router.push('/') instead
      window.location.href = "/"
    }, 2000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    setFormData((prev) => ({
      ...prev,
      role: type,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Arrow - Fixed positioning for better mobile experience */}
      <div className="fixed top-4 left-4 z-10 sm:top-6 sm:left-6">
        <Link to="/" className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => handleUserTypeChange("jobseeker")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                userType === "jobseeker"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange("employer")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                userType === "employer"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Employer
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-800 transition-colors duration-200`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-800 transition-colors duration-200`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              {/* Company Name (for employers) */}
              {userType === "employer" && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                        errors.company
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-800 transition-colors duration-200`}
                      placeholder="Enter your company name"
                    />
                  </div>
                  {errors.company && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company}</p>}
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-800 transition-colors duration-200`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-800 transition-colors duration-200`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded mt-0.5 flex-shrink-0"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 leading-5">
                  I agree to the{" "}
                  <Link to="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register