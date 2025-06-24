"use client"

import { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiSend, FiPaperclip, FiSearch } from "react-icons/fi"


const mockConversations = [
  {
    id: "1",
    applicantName: "John Doe",
    jobTitle: "Frontend Developer",
    lastMessage: "Thank you for considering my application. I'm very excited about this opportunity.",
    timestamp: "2 hours ago",
    unread: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    applicantName: "Jane Smith",
    jobTitle: "UI/UX Designer",
    lastMessage: "I've attached my portfolio for your review.",
    timestamp: "1 day ago",
    unread: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    applicantName: "Mike Johnson",
    jobTitle: "Backend Developer",
    lastMessage: "Looking forward to hearing from you soon.",
    timestamp: "3 days ago",
    unread: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockMessages = {
  "1": [
    {
      id: "1",
      text: "Hello John! Thank you for applying to the Frontend Developer position at our company.",
      sender: "employer",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Thank you for considering my application. I'm very excited about this opportunity.",
      sender: "applicant",
      timestamp: "10:45 AM",
    },
    {
      id: "3",
      text: "We were impressed with your portfolio. Would you be available for a technical interview next week?",
      sender: "employer",
      timestamp: "11:00 AM",
    },
    {
      id: "4",
      text: "I'm available Monday through Friday after 2 PM. What time works best for you?",
      sender: "applicant",
      timestamp: "11:15 AM",
    },
  ],
  "2": [
    {
      id: "1",
      text: "Hi Jane! We received your application for the UI/UX Designer role.",
      sender: "employer",
      timestamp: "Yesterday 2:30 PM",
    },
    {
      id: "2",
      text: "Hello! Thank you for reaching out. I've attached my portfolio for your review.",
      sender: "applicant",
      timestamp: "Yesterday 3:00 PM",
    },
  ],
}

const EmployerMessages = ()=>{
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const selectedConv = mockConversations.find((conv) => conv.id === selectedConversation)
  const messages = mockMessages[selectedConversation] || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full">
            {filteredConversations.filter((conv) => conv.unread).length} unread
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <DashboardCard className="h-full">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Conversations */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.applicantName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {conversation.applicantName}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 truncate">{conversation.jobTitle}</p>
                          </div>
                          {conversation.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{conversation.timestamp}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <DashboardCard className="h-full flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <img
                    src={selectedConv.avatar || "/placeholder.svg"}
                    alt={selectedConv.applicantName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedConv.applicantName}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{selectedConv.jobTitle}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[400px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "employer" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "employer"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "employer" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export default EmployerMessages