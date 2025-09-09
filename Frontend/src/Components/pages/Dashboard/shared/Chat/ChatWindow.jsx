import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

const ChatWindow = () => {
  const { activeChat, messages, loadMessages, markSeen, isTyping, userData } = useChat();
  const messagesEndRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [lastLoadedChatId, setLastLoadedChatId] = useState(null);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat?._id && activeChat._id !== lastLoadedChatId) {
      setIsLoadingMessages(true);
      loadMessages(activeChat._id)
        .then(() => setLastLoadedChatId(activeChat._id))
        .finally(() => setIsLoadingMessages(false));
    }
  }, [activeChat?._id, loadMessages, lastLoadedChatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoadingMessages]);

  // Mark unseen messages as seen
  useEffect(() => {
    if (activeChat && messages.length > 0 && userData?._id) {
      const unseenMessages = messages.filter(
        (msg) => msg.sender?._id !== userData?._id && !msg.seenBy?.some(user => user._id === userData._id)
      );
      if (unseenMessages.length > 0) {
        const messageIds = unseenMessages.map((msg) => msg._id);
        markSeen({ chatId: activeChat._id, messageIds });
      }
    }
  }, [messages, activeChat, userData?._id, markSeen]);

  // If no active chat, show prompt
  if (!activeChat) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-4">
        <p className="text-lg text-gray-500 text-center">Select a chat to start messaging</p>
      </div>
    );
  }

  // Determine other user's name for typing indicator
  const otherUser = activeChat.sender._id === userData?._id ? activeChat.receiver : activeChat.sender;
  const typingUserName = otherUser?.jobSeekerInfo?.fullName || otherUser?.companyInfo?.companyName || "Someone";

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        {/* Optional Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239CA3AF' fillOpacity='0.1'%3E%3Cpath d='M30 0h1v60h-1V0zm-4 30h8v1h-8v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative h-full overflow-y-auto px-3 py-3 flex flex-col space-y-2 custom-scrollbar">
          {isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} currentUserId={userData?._id} />
              {isTyping && <TypingIndicator user={typingUserName} />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="w-full border-t border-gray-200 bg-white flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;
