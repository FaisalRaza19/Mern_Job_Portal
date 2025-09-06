import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi"
import { FaBuilding, FaArrowLeft } from "react-icons/fa"
import { Context } from "../../Context/context"

const Register = () => {
  const { userAuth, showAlert } = useContext(Context)
  const { register } = userAuth
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("jobseeker")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    role: "jobseeker",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (userType === "jobseeker" && !formData.fullName.trim())
      newErrors.fullName = "Full Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (userType === "employer" && !formData.companyName.trim())
      newErrors.companyName = "Company name is required for employers"

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const data = await register(formData)
      showAlert(data)
      if (data.statusCode === 200) navigate("/email-verify")
    } catch (error) {
      console.log("register", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    setFormData((prev) => ({
      ...prev,
      role: type,
      fullName: type === "employer" ? "" : prev.fullName,
      companyName: type === "employer" ? prev.companyName : "",
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-6 sm:py-12">
      {/* Back Arrow */}
      <div className="fixed top-4 left-4 z-10">
        <Link
          to="/"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl space-y-6 bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
          {["jobseeker", "employer"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleUserTypeChange(type)}
              className={`flex-1 rounded-md px-3 py-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${userType === type
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {type === "jobseeker" ? "Job Seeker" : "Employer"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name / Company Name */}
          {userType !== "employer" ? (
            <InputField
              label="Full Name"
              icon={<FiUser className="h-5 w-5 text-gray-400" />}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.fullName}
            />
          ) : (
            <InputField
              label="Company Name"
              icon={<FaBuilding className="h-5 w-5 text-gray-400" />}
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              error={errors.companyName}
            />
          )}

          {/* Email */}
          <InputField
            label="Email Address"
            icon={<FiMail className="h-5 w-5 text-gray-400" />}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          {/* Password */}
          <InputField
            label="Password"
            icon={<FiLock className="h-5 w-5 text-gray-400" />}
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            error={errors.password}
            showToggle={true}
            toggle={() => setShowPassword(!showPassword)}
            show={showPassword}
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            icon={<FiLock className="h-5 w-5 text-gray-400" />}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            showToggle={true}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            show={showConfirmPassword}
          />

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-0.5 flex-shrink-0"
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-xs sm:text-sm md:text-base text-gray-700">
              I agree to the{" "}
              <Link to="#" className="text-blue-600 hover:text-blue-500 hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-blue-600 hover:text-blue-500 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-xs sm:text-sm md:text-[14px] text-red-600">{errors.agreeToTerms}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-xs sm:text-sm md:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
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
        </form>
      </div>
    </div>
  )
}

// Reusable InputField component
const InputField = ({
  label,
  icon,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  showToggle = false,
  toggle,
  show = false,
}) => (
  <div>
    <label className="block text-xs sm:text-sm md:text-[14px] font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200`}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={toggle}
        >
          {show ? <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
        </button>
      )}
    </div>
    {error && <p className="mt-1 text-xs sm:text-sm md:text-[14px] text-red-600">{error}</p>}
  </div>
)

export default Register
