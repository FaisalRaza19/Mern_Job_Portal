import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"
import { FaArrowLeft } from "react-icons/fa"
import { Context } from "../../Context/context"

const Login = ({ setIsLoggedIn }) => {
  const { userAuth, setUserData, setIsEmployer, showAlert } = useContext(Context)
  const { Login, forgetPass } = userAuth
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", userName: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResetSuccess, setShowResetSuccess] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email && !formData.userName) {
      newErrors.email = "Email or Username is required";
    } else {
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (formData.userName && !/^[a-zA-Z0-9_]{3,20}$/.test(formData.userName)) {
        newErrors.userName = "Username is invalid";
      }
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters and include one special character";
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
      }
      if (data?.data?.role === "employer") {
        setIsEmployer(true)
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleForgetPass = async () => {
    try {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        showAlert({ statusCode: 400, message: "Please enter a valid email" });
        return;
      }
      setIsLoading(true);
      const data = await forgetPass({ email: formData.email });
      showAlert(data);

      if (data?.statusCode === 200) {
        setShowResetSuccess(true);
      }
    } catch (error) {
      console.error("Forget Password Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10 sm:top-6 sm:left-6">
        {showResetSuccess ? (
          <button
            onClick={() => setShowResetSuccess(false)}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
        ) : (
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          </Link>
        )}
      </div>

      {/* Main */}
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">

          {showResetSuccess ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Password Reset Email Sent to {formData.email}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We've sent you an email with a link to reset your password.
                Please check your inbox.
              </p>
              <button
                onClick={() => setShowResetSuccess(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Or{" "}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    create a new account
                  </Link>
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email or Username */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address or Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 z-20 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          } placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 transition-colors duration-200`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 z-20 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          } placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 transition-colors duration-200`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Remember me</span>
                  </label>
                  <span
                    onClick={handleForgetPass}
                    className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot your password?
                  </span>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
    </div>
  )
}

export default Login;
