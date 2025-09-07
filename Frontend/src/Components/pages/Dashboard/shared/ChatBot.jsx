import { useState, useRef, useEffect, useContext } from "react"
import { Context } from "../../../../Context/context.jsx"
import { fetchGPTResponse } from "../../../../temp/suggestedSkilss.js"
import { FiX, FiSend, FiUser, FiRefreshCw, FiCopy } from "react-icons/fi"
import { FaRobot } from "react-icons/fa"

const Chatbot = ({ isOpen, onClose }) => {
  const { userData } = useContext(Context)
  const user = userData

  // ✅ Persist chat in sessionStorage (survives until refresh/close)
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("chatHistory")
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            type: "bot",
            content: `Hello ${user?.companyInfo?.companyName || user?.User?.fullName || "there"}! I'm your AI Assistant. How can I assist you today?`,
            timestamp: new Date(),
          },
        ]
  })

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // ✅ Light theme styles
  const modalBg = "bg-white border border-gray-200"
  const headerBg = "border-gray-200"
  const headerTextColor = "text-gray-900"
  const mutedTextColor = "text-gray-500"
  const refreshButtonClass = "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
  const userMessageBg = "bg-blue-500 text-white"
  const botMessageBg = "bg-gray-100 text-gray-700"
  const inputClass = "bg-white border border-gray-300 text-gray-900"
  const sendButtonClass = "bg-blue-500 hover:bg-blue-600 text-white"
  const spinnerColor = "border-blue-600 border-t-transparent"

  // ✅ Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    sessionStorage.setItem("chatHistory", JSON.stringify(messages)) // save every update
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const addMessage = (type, content) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type, content, timestamp: new Date() },
    ])
  }

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage || isLoading) return

    addMessage("user", trimmedMessage)
    setInputMessage("")
    setIsLoading(true)

    try {
      let gptResponse = await fetchGPTResponse(trimmedMessage)

      // ✅ Auto-wrap AI responses with code fences if it looks like code
      if (/function|const|let|var|class|\{|\}|\(|\)|<.*>/.test(gptResponse)) {
        gptResponse = `\`\`\`js\n${gptResponse}\n\`\`\``
      }

      addMessage("bot", gptResponse)
    } catch (error) {
      addMessage("bot", "⚠️ Oops! Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    const welcomeMessage = {
      id: 1,
      type: "bot",
      content: `Hello ${user?.companyInfo?.companyName || user?.User?.fullName || "there"}! I'm your AI Assistant. How can I assist you today?`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    sessionStorage.removeItem("chatHistory") // reset storage
  }

  // ✅ Detect and render code blocks
  const renderMessageContent = (content) => {
    const codeBlockRegex = /```([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", text: content.slice(lastIndex, match.index) })
      }
      parts.push({ type: "code", text: match[1].trim() })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", text: content.slice(lastIndex) })
    }

    return parts
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col shadow-2xl ${modalBg}`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${headerTextColor}`}>AI ChatBot</h3>
              <p className={`text-sm ${mutedTextColor}`}>AI-powered</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearChat} className={`p-2 rounded-lg transition-colors ${refreshButtonClass}`} title="Clear Chat">
              <FiRefreshCw className="h-4 w-4" />
            </button>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${refreshButtonClass}`} title="Close">
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "bot" && (
                <div className="h-8 w-8 rounded-full flex-shrink-0 items-center justify-center flex bg-gray-200">
                  <FaRobot className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-lg ${message.type === "user" ? userMessageBg : botMessageBg}`}>
                {renderMessageContent(message.content).map((part, idx) =>
                  part.type === "code" ? (
                    <div key={idx} className="relative group my-2">
                      <pre className="bg-black text-white text-sm p-3 rounded-lg overflow-x-auto">
                        <code>{part.text}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(part.text)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-xs text-gray-400 hover:text-white"
                        title="Copy code"
                      >
                        <FiCopy />
                      </button>
                    </div>
                  ) : (
                    <p key={idx} className="text-sm whitespace-pre-line">{part.text}</p>
                  )
                )}
                <div className="text-xs opacity-70 mt-2 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {message.type === "user" && (
                <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex-shrink-0 items-center justify-center flex">
                  <FiUser className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full flex-shrink-0 items-center justify-center flex bg-gray-200">
                <FaRobot className="h-4 w-4" />
              </div>
              <div className={`${botMessageBg} p-3 rounded-lg`}>
                <div className="flex items-center gap-2">
                  <div className={`animate-spin h-4 w-4 border-2 rounded-full ${spinnerColor}`}></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${headerBg}`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${inputClass}`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${sendButtonClass}`}
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
