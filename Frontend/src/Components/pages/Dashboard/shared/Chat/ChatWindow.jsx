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

  // Effect to load messages when activeChat changes
  useEffect(() => {
    if (activeChat?._id && activeChat._id !== lastLoadedChatId) {
      setIsLoadingMessages(true);
      loadMessages(activeChat._id)
        .then(() => {
          setLastLoadedChatId(activeChat._id);
        })
        .finally(() => {
          setIsLoadingMessages(false);
        });
    }
  }, [activeChat?._id, loadMessages, lastLoadedChatId]);

  // Effect to scroll to the bottom of the messages list
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoadingMessages]);

  // Effect to mark messages as seen when the chat is active and new unseen messages arrive
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

  // Display a prompt if no chat is active
  if (!activeChat) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 items-center justify-center">
        <div className="text-center p-4">
          <p className="text-lg text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  // Determine the name for the typing indicator
  const otherUser = activeChat.sender._id === userData?._id ? activeChat.receiver : activeChat.sender;
  const typingUserName = otherUser?.jobSeekerInfo?.fullName || otherUser?.companyInfo?.companyName || 'Someone';


  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
        {/* Background Pattern for aesthetics */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239CA3AF' fillOpacity='0.1'%3E%3Cpath d='M30 0h1v60h-1V0zm-4 30h8v1h-8v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative h-full overflow-y-auto px-4 py-4 custom-scrollbar">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
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

      {/* Message Input Component */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
