import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Context } from "../../Context/context";

const EmailVerify = ({ setIsLogedIn }) => {
  const email = localStorage.getItem("email");
  const { userAuth, setUserData, isEmployer, setIsEmployer, userProfile, showAlert } = useContext(Context);
  const { isEditProfile } = userProfile;
  const { ResendCode, verify_register, verifyAndUpdateProfile } = userAuth;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading,setIsResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(null);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[activeInput]?.focus();
  }, [activeInput]);

  useEffect(() => {
    if (!resendTimer) return;
    const interval = setInterval(() => setResendTimer(prev => (prev > 0 ? prev - 1 : null)), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length === 6) {
      setOtp(value.split("").slice(0, 6));
      setActiveInput(5);
      setError("");
      return;
    }
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setError("");
    if (value && index < 5) setActiveInput(index + 1);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      } else if (index > 0) setActiveInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      setActiveInput(5);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some(d => d.trim() === "")) {
      setError("Please enter all 6 digits of the code");
      return;
    }
    setIsLoading(true);
    try {
      const code = otp.join("");
      if (isEditProfile) {
        const data = await verifyAndUpdateProfile({ code });
        showAlert(data);
        if (data.statusCode === 200) {
          setUserData(data.data);
          setIsLogedIn(true);
          navigate(isEmployer ? "/employer-dashboard" : "/jobseeker-dashboard");
          localStorage.removeItem("email");
        }
      } else {
        const data = await verify_register({ code, navigate });
        showAlert(data);
        if (data.statusCode === 200) {
          setIsLogedIn(true);
          setIsEmployer(data.data.role === "employer");
          setUserData(data.data);
          localStorage.removeItem("email");
        }
      }
    } catch (error) {
      console.log("verify email", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setActiveInput(0);
    setError("");
    setIsResendLoading(true)
    try {
      const data = await ResendCode();
      showAlert(data);
      if (data.statusCode === 200) {
        setResendTimer(60);
      }
    } catch (error) {
      console.log("resend code", error.message);

    } finally {
      setIsResendLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      {/* Back Arrow */}
      <div className="fixed top-4 left-4 z-10">
        <Link
          to={isEditProfile ? (isEmployer ? "/employer-dashboard" : "/jobseeker-dashboard") : "/register"}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md p-6 rounded-xl bg-white shadow-lg border border-gray-200 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <FiMail className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-sm text-gray-600 break-words">
            Enter the 6-digit code we sent to <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
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
                onClick={() => setActiveInput(i)}
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 text-center text-base sm:text-lg md:text-lg font-semibold border-2 rounded-lg transition-all duration-200 ${activeInput === i ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"} ${digit ? "bg-blue-50 border-blue-300" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-blue-200`}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
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

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer !== null && resendTimer > 0}
            className={`inline-flex items-center text-sm font-medium transition-colors ${resendTimer !== null && resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700"}`}
          >
            <FiRefreshCw className={`mr-1 w-4 h-4 ${resendTimer !== null && resendTimer > 0 ? "" : "hover:rotate-180 transition-transform duration-300"}`} />
            {resendTimer !== null && resendTimer > 0 ? `Resend in ${resendTimer}s` : (isResendLoading ? "Resending Email..." : "Resend Code")}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 text-center">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
