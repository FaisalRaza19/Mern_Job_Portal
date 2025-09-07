import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"
import { FaArrowLeft } from "react-icons/fa"
import { Context } from "../../Context/context"

const Login = ({ setIsLoggedIn }) => {
  const { userAuth, setUserData, setIsEmployer, showAlert } = useContext(Context)
  const { Login, forgetPass } = userAuth
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResetSuccess, setShowResetSuccess] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with upper, lower, number & special char"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const data = await Login({ formData, navigate })
      showAlert(data)
      if (data?.statusCode === 200) {
        setIsLoggedIn(true)
        setUserData(data.data)
        if (data?.data?.role === "employer") setIsEmployer(true)
      }
    } catch (error) {
      console.log("Login ", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleForgetPass = async () => {
    try {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        showAlert({ statusCode: 400, message: "Please enter a valid email" })
        return
      }
      setIsLoading(true)
      const data = await forgetPass({ email: formData.email })
      showAlert(data)
      if (data?.statusCode === 200) setShowResetSuccess(true)
    } catch (error) {
      console.error("Forget Password Error:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        {showResetSuccess ? (
          <button
            onClick={() => setShowResetSuccess(false)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
        ) : (
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
        {showResetSuccess ? (
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Password Reset Email Sent
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              We’ve sent a reset link to{" "}
              <span className="font-medium">{formData.email}</span>.
              Please check your inbox.
            </p>
            <button
              onClick={() => setShowResetSuccess(false)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-600">
                Or{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-3 py-3 text-sm border ${errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-3 text-sm border ${errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 transition`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <span
                  onClick={handleForgetPass}
                  className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot your password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Login
