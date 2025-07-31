import React from "react"
import { FiMessageCircle, FiLock, FiSmartphone } from "react-icons/fi"

const WelcomeScreen = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center max-w-md px-8">
        {/* Logo/Icon */}
        <div className="w-32 h-32 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
          <FiMessageCircle className="w-16 h-16 text-green-600" />
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl font-light text-gray-800 mb-4">Welcome to Professional Chat</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Send and receive messages, photos, videos, and voice notes. Stay connected with your professional network.
        </p>

        {/* Features */}
        <div className="space-y-4 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <FiLock className="w-4 h-4" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FiSmartphone className="w-4 h-4" />
            <span>Works on all devices</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Select a conversation from the sidebar to start messaging, or create a new chat to begin.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
