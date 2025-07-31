import React, { useState, useContext } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import { Context } from "../../../../../Context/context.jsx";
import { FiArrowLeft, FiMoreVertical, FiPhone, FiVideo, FiSearch, FiTrash2, FiArchive, FiInfo } from "react-icons/fi";

const ChatHeader = () => {
  const { activeChat, setActiveChat, deleteChat } = useChat();
  const { userData } = useContext(Context);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  if (!activeChat) return null;

  // Determine the other user in the chat
  const otherUser = activeChat.sender._id === userData?._id ? activeChat.receiver : activeChat.sender;
  const name = otherUser?.jobSeekerInfo?.fullName || otherUser?.companyInfo?.companyName || "Unknown User";
  const avatar = otherUser?.avatar?.avatar_Url || "/placeholder.svg?height=40&width=40";
  const isOnline = otherUser?.isOnline;

  // Formats last seen timestamp into a human-readable string
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "last seen recently";

    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "last seen just now";
    if (minutes < 60) return `last seen ${minutes}m ago`;
    if (hours < 24) return `last seen ${hours}h ago`;
    if (days < 7) return `last seen ${days}d ago`;
    return `last seen ${date.toLocaleDateString()}`;
  };

  // Handles chat deletion confirmation
  const handleDeleteChat = () => {
    setShowDeleteConfirmModal(true);
  };

  // Confirms and executes chat deletion
  const confirmDeleteChat = () => {
    deleteChat(activeChat._id);
    setActiveChat(null);
    setShowDeleteConfirmModal(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Back Button (visible on mobile) */}
        <button
          onClick={() => setActiveChat(null)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Back to chats"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* User Info */}
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=40&width=40"; // Fallback image
            }}
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isOnline ? "online" : formatLastSeen(otherUser?.lastSeen)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Video Call">
          <FiVideo className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Audio Call">
          <FiPhone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Search in chat">
          <FiSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="More options"
          >
            <FiMoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                <FiInfo className="w-4 h-4" />
                <span>Contact info</span>
              </button>
              <button className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                <FiSearch className="w-4 h-4" />
                <span>Search messages</span>
              </button>
              <button className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                <FiArchive className="w-4 h-4" />
                <span>Archive chat</span>
              </button>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button
                onClick={handleDeleteChat}
                className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Delete Chat</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this chat? This action cannot be undone and will delete the chat for both
              users.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
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

export default ChatHeader;
