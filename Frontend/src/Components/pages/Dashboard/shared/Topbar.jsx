import { useContext, useState } from "react"
import { Context } from "../../../../Context/context.jsx"
import { FiBell, FiSun, FiMoon, FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi"
import { useNavigate } from "react-router-dom";

const Topbar = ({ onMenuClick, notifications = [], setIsLoggedIn, activeTab, isEmployer }) => {
  const { userAuth, userData, userImage, verifyUser } = useContext(Context);
  const { isVerify, isLoggedIn } = verifyUser
  const { image } = userImage;
  const { LogOut } = userAuth;
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useState("dark")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const user = userData;
  const unreadCount = notifications.filter((n) => !n.read).length
  if (!isLoggedIn) {
    if (!isVerify) {
      navigate("/");
      setIsLoggedIn(false)
    }
  }

  // logout the user
  const logOut = async () => {
    try {
      const data = await LogOut({ navigate, });
      if (data.statusCode === 200) {
        setIsLoggedIn(false)
      }

    } catch (error) {
      console.log("logOut", error.message)
    }
  }


  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user?.role === "jobseeker" ? "Job Seeker Dashboard" : "Employer Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5 text-gray-600" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
                      >
                        <p className="text-sm text-gray-900 dark:text-white">{notification.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <img src={image || user?.avatar?.avatar_Url || "/placeholder.svg?height=32&width=32"} alt="" className="w-8 h-8 rounded-full" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-2">
                  {!isEmployer &&
                    <button onClick={() => activeTab("profile")}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  }
                  <button onClick={() => { (isEmployer ? activeTab("settings") : activeTab("setting")), setShowProfile(false) }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <FiSettings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => logOut()}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
    </header>
  )
}

export default Topbar