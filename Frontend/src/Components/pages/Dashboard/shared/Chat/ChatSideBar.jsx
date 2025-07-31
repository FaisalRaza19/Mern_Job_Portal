import React, { useState, useContext, useEffect, useCallback } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import { Context } from "../../../../../Context/context.jsx";
import { FiSearch, FiMessageCircle } from "react-icons/fi";
import ChatListItem from "./ChatListItem.jsx";

const ChatSidebar = () => {
  const { chats, activeChat, setActiveChat, deleteChat, fetchChats, setMessages } = useChat();
  const { userData } = useContext(Context);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(true);

  // Effect to fetch chats when user data is available
  useEffect(() => {
    const loadChats = async () => {
      setIsChatLoading(true);
      try {
        if (userData?._id) {
          await fetchChats();
        }
      } catch (error) {
        console.error("Error during fetch chat:", error.message);
      } finally {
        setIsChatLoading(false);
      }
    };

    loadChats();
  }, [userData, fetchChats]);

  // Memoized function to get the other user in a chat
  const getOtherUser = useCallback(
    (chat) => {
      return chat.sender._id === userData?._id ? chat.receiver : chat.sender;
    },
    [userData],
  );

  // Filter chats based on search term
  const filteredChats =
    chats?.filter((chat) => {
      const otherUser = getOtherUser(chat);
      const name = otherUser?.jobSeekerInfo?.fullName || otherUser?.companyInfo?.companyName || "Unknown User";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  // Handles the actual deletion
  const handleDeleteChat = (chatId) => {
    deleteChat(chatId);
    setShowDeleteConfirm(null);
    if (activeChat?._id === chatId) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500"
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isChatLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <FiMessageCircle className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">{searchTerm ? "No chats found" : "No conversations yet"}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {searchTerm ? "Try a different search term" : "Start a new conversation"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat._id}
                chat={chat}
                currentUserId={userData?._id}
                onDeleteChat={() => setShowDeleteConfirm(chat._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Delete Chat</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this chat? This action cannot be undone and will delete the chat for both
              users.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteChat(showDeleteConfirm)}
                className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
