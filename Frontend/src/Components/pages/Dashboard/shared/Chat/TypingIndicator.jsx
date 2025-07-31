import  React from "react"

const TypingIndicator = ({user}) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <span className="text-sm text-gray-500 ml-2">{user} is typing...</span>
      </div>
    </div>
  )
}

export default TypingIndicator
