import { useContext, useState } from "react"
import { Context } from "../../../../Context/context.jsx"
import { FiBell, FiUser, FiSettings, FiLogOut, FiMenu, FiMessageSquare } from "react-icons/fi"
import { FaRobot } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import ChatBot from "./ChatBot.jsx"

const Topbar = ({ onMenuClick, notifications = [], setIsLoggedIn, activeTab, isEmployer }) => {
  const { userAuth, userData, setUserData, userImage, verifyUser, showAlert } = useContext(Context)
  const { isVerify, isLoggedIn } = verifyUser
  const { image } = userImage
  const { LogOut } = userAuth
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const user = userData
  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isLoggedIn) {
    if (!isVerify) {
      navigate("/")
      setIsLoggedIn(false)
    }
  }

  // logout
  const logOut = async () => {
    try {
      const data = await LogOut({ navigate })
      showAlert(data)
      if (data.statusCode === 200) {
        setIsLoggedIn(false)
        setUserData("")
      }
    } catch (error) {
      console.log("logOut", error.message)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Title + Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>
          {/* <h1 className="text-xl font-semibold text-gray-900 sm:hidden">
            {user?.role === "jobseeker" ? "Job Seeker Dashboard" : "Employer Dashboard"}
          </h1> */}
          <h1 className="hidden sm:block font-semibold text-gray-900 text-2xl">
            {user?.role === "jobseeker" ? "Job Seeker Dashboard" : "Employer Dashboard"}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Messages */}
          <button
            onClick={() => activeTab("messages")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMessageSquare className="w-5 h-5 text-gray-600" />
          </button>

          {/* Chatbot */}
          <button onClick={() => setShowChatbot(true)} className="p-2 rounded-lg relative hover:bg-gray-200" title="Open Legal Assistant">
            <FaRobot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""
                          }`}
                      >
                        <p className="text-sm text-gray-900">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={image || user?.avatar?.avatar_Url || "/placeholder.svg?height=32&width=32"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  {!isEmployer && (
                    <button
                      onClick={() => activeTab("profile")}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      activeTab("settings")
                      setShowProfile(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatBot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </header>
  )
}

export default Topbar
