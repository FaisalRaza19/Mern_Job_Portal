import { useState, useRef, useEffect } from "react"
import {Link} from "react-router-dom"
import { FiMail, FiRefreshCw, FiCheckCircle } from "react-icons/fi"
import { FaArrowLeft } from "react-icons/fa"

const EmailVerify = ({ email = "you@example.com", onVerify })=>{
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [activeInput, setActiveInput] = useState(0)
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(null)

  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[activeInput]?.focus()
  }, [activeInput])

  // Start 60 sec countdown when resendTimer is set
  useEffect(() => {
    if (resendTimer === null || resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev && prev > 0 ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleChange = (value,index) => {
    if (!/^\d*$/.test(value)) return

    if (value.length === 6) {
      const otpArray = value.split("").slice(0, 6)
      setOtp(otpArray)
      setActiveInput(5)
      return
    }

    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    setError("")

    if (value && index < 5) setActiveInput(index + 1)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOtp = [...otp]
        updatedOtp[index] = ""
        setOtp(updatedOtp)
      } else if (index > 0) {
        setActiveInput(index - 1)
      }
    }
  }

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim()
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split("")
      setOtp(otpArray)
      setActiveInput(5)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.some((digit) => digit === "")) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsVerifying(true)
    const code = otp.join("")

    setTimeout(() => {
      setIsVerifying(false)
      if (onVerify) onVerify(code)
    }, 2000)
  }

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""])
    setActiveInput(0)
    setResendTimer(60)
    console.log("Resending code to:", email)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Arrow - Fixed positioning for better mobile experience */}
      <div className="fixed top-4 left-4 z-10 sm:top-6 sm:left-6">
        <Link to="/"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiMail className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Enter the 6-digit code we sent to{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 break-all">{email}</span>
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-xl md:text-2xl font-semibold border-2 rounded-lg transition-all duration-200 ${
                    activeInput === i
                      ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                      : "border-gray-300 dark:border-gray-600"
                  } ${
                    digit
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600"
                      : "bg-white dark:bg-gray-700"
                  } text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800`}
                  onClick={() => setActiveInput(i)}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center">
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex justify-center items-center px-4 py-3 sm:py-4 rounded-lg bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Verifying...
                </div>
              ) : (
                <>
                  <FiCheckCircle className="mr-2 w-5 h-5" />
                  Verify Code
                </>
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{"Didn't receive the code?"}</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer !== null && resendTimer > 0}
              className={`inline-flex items-center text-sm font-medium transition-colors ${
                resendTimer !== null && resendTimer > 0
                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              }`}
            >
              <FiRefreshCw
                className={`mr-1 w-4 h-4 ${
                  resendTimer !== null && resendTimer > 0 ? "" : "hover:rotate-180 transition-transform duration-300"
                }`}
              />
              {resendTimer !== null && resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </div>

          {/* Helper Text */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify