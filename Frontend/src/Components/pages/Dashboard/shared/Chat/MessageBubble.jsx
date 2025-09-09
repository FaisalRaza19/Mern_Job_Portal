import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import {
  FiCheck, FiCheckCircle, FiClock, FiEdit3, FiTrash2, FiDownload, FiPlay, FiPause, FiMic, FiFile, FiMoreVertical,
} from "react-icons/fi";

const MessageBubble = ({ message, isOwn, isFirstInGroup, isLastInGroup }) => {
  const { editMessage, deleteMessage, userData, activeChat } = useChat();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const dropdownRef = useRef(null);
  const speedDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
      if (
        showSpeedDropdown &&
        speedDropdownRef.current &&
        !speedDropdownRef.current.contains(event.target)
      ) {
        setShowSpeedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showSpeedDropdown]);

  // Update current time on audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  // Handle playback speed change
  const handleSpeedChange = (speed) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedDropdown(false);
    }
  };

  // Formats timestamp for display
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Formats seconds into MM:SS format
  const formatDuration = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  // Determines the message status icon
  const getMessageStatus = () => {
    if (!isOwn) return null;

    const hasBeenSeenByOther = message.seenBy?.some(user => user._id !== userData._id);
    const hasBeenDeliveredToOther = message.deliveredTo?.some(user =>
      activeChat && user._id === (activeChat.sender._id === userData._id ? activeChat.receiver._id : activeChat.sender._id)
    );

    if (hasBeenSeenByOther) {
      return <FiCheckCircle className="w-4 h-4 text-blue-400" />;
    }
    if (hasBeenDeliveredToOther) {
      return (
        <span className="relative">
          <FiCheck className="w-4 h-4 text-gray-400 absolute left-0 top-0" />
          <FiCheck className="w-4 h-4 text-gray-400 absolute left-2 top-0" />
        </span>
      );
    }
    if (message.status === "sending") {
      return <FiClock className="w-4 h-4 text-gray-400 animate-pulse" />;
    }
    return <FiCheck className="w-4 h-4 text-gray-400" />;
  };

  // Handles editing a message
  const handleEdit = () => {
    if (editText.trim() && editText !== message.content) {
      editMessage(message._id, editText.trim());
    }
    setIsEditing(false);
    setShowDropdown(false);
  };

  // Handles deleting a message
  const handleDelete = (mode) => {
    deleteMessage(message._id, mode);
    setShowDropdown(false);
  };

  // Toggles audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Renders the content of the message based on its type
  const renderMessageContent = () => {
    if (message.isDeletedForEveryone) {
      return (
        <div className="italic text-gray-400 text-sm flex items-center">
          <FiTrash2 className="w-4 h-4 inline mr-1" />
          This message was deleted
        </div>
      );
    }

    // Render edit input for text messages
    if (isEditing && message.messageType === "text") {
      return (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            rows={2}
            autoFocus
          />
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    // Render content based on message type
    switch (message.messageType) {
      case "text":
        return (
          <div>
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            {message.isEdited && <span className="text-xs text-gray-400 italic ml-1">edited</span>}
          </div>
        );

      case "voice":
        return (
          <div className="flex items-center space-x-3 min-w-[200px]">
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full ${isOwn ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"} hover:opacity-80 transition-opacity`}
              aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
            >
              {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-1 mb-1 text-xs text-gray-600">
                <FiMic className="w-3 h-3" />
                <span>Voice message</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${isOwn ? "bg-green-200" : "bg-gray-400"}`}
                    style={{ height: `${Math.random() * 20 + 8}px` }}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500 ">
              {message.duration ? `${Math.floor(message.duration)}s` : "0:00"}
            </span>
            <audio
              ref={audioRef}
              src={message.content}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              preload="none"
            />
          </div>
        );

      case "audio":
        const remainingTime = formatDuration(message.duration - currentTime);
        const displayTime = isPlaying ? remainingTime : formatDuration(message.duration);

        return (
          <div className={`relative flex items-center space-x-3 p-2 rounded-full w-full min-w-48 max-w-sm sm:max-w-md ${isOwn ? "bg-gray-300" : "bg-gray-900"} text-white`}>
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                } text-white focus:outline-none focus:ring-2 focus:ring-green-400`}
              aria-label={isPlaying ? "Pause audio message" : "Play audio message"}
            >
              {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
            </button>

            {/* Progress bar and time */}
            <div className="flex-1 flex items-center space-x-2">
              <span className={`text-xs ${isOwn ? "text-gray-600" : "text-gray-400"}`}>
                {displayTime}
              </span>
              <div className={`h-1 w-full rounded-full ${isOwn ? "bg-gray-400" : "bg-gray-700"}`}>
                <div
                  className={`h-1 rounded-full ${isOwn ? "bg-green-600" : "bg-green-600"}`}
                  style={{ width: `${(currentTime / message.duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Playback speed options */}
            <div className="relative" ref={speedDropdownRef}>
              <button
                onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                className={`px-2 py-1 text-xs font-semibold rounded-full ${isOwn ? "text-gray-700 bg-gray-200" : "text-white bg-gray-700"} hover:opacity-80 transition-opacity`}
              >
                {playbackSpeed.toFixed(1)}x
              </button>
              {showSpeedDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg py-1 min-w-max z-50">
                  <button onClick={() => handleSpeedChange(1)} className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left">1.0x</button>
                  <button onClick={() => handleSpeedChange(1.5)} className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left">1.5x</button>
                  <button onClick={() => handleSpeedChange(2)} className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left">2.0x</button>
                </div>
              )}
            </div>

            <audio
              ref={audioRef}
              src={message.content}
              onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              preload="none"
              className="hidden" // Hides the default audio element
            />
          </div>
        );

      case "image":
        return (
          <div className="max-w-xs rounded-lg overflow-hidden">
            <img
              src={message.content || "/placeholder.svg"}
              alt="Image"
              className="w-full h-auto object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.content, "_blank")}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=200";
              }}
            />
          </div>
        );

      case "video":
        return (
          <div className="max-w-xs rounded-lg overflow-hidden">
            <video controls className="w-full h-auto rounded-lg" style={{ maxHeight: "300px" }} preload="none">
              <source src={message.content} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "file":
        return (
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <FiFile className="w-6 h-6 text-gray-500 " />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{message.fileName || "File"}</p>
              <p className="text-xs text-gray-500 ">Document</p>
            </div>
            <a
              href={message.content}
              download={message.fileName || "download"}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              aria-label={`Download ${message.fileName || "file"}`}
            >
              <FiDownload className="w-4 h-4" />
            </a>
          </div>
        );

      default:
        return <p className="text-sm text-gray-900">{message.content}</p>;
    }
  };

  const isHiddenForMe = message.deletedFor?.some(id => id._id === userData?._id);
  if (isHiddenForMe && !message.isDeletedForEveryone) {
    return null;
  }

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
    >
      <div className={`flex max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2`}>
        {/* Avatar (only for first message in group from others) */}
        {!isOwn && isFirstInGroup && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={message.sender?.avatar?.avatar_Url || "/placeholder.svg?height=32&width=32"}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg?height=32&width=32"; }}
            />
          </div>
        )}

        {/* Spacer for alignment when avatar is not shown for consistency */}
        {!isOwn && !isFirstInGroup && <div className="w-8" />}

        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-2xl shadow-sm max-w-full text-white
              ${isOwn
                ? `bg-gray-500 ${isFirstInGroup ? "rounded-tr-md" : ""
                } ${isLastInGroup ? "rounded-br-md" : ""}`
                : `bg-gray-900 border border-gray-200 ${isFirstInGroup ? "rounded-tl-md" : ""
                } ${isLastInGroup ? "rounded-bl-md" : ""}`
              }`}
          >
            {renderMessageContent()}
          </div>

          {/* Message Info (time and status) - only for the last bubble in a group and not editing */}
          {isLastInGroup && !isEditing && message.messageType !== "audio" && (
            <div
              className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${isOwn ? "flex-row-reverse space-x-reverse" : ""
                }`}
            >
              <span>{formatTime(message.createdAt)}</span>
              {getMessageStatus()}
            </div>
          )}
        </div>

        {/* Message Actions Dropdown (for own messages, not deleted, and not editing) */}
        {isOwn && !message.isDeletedForEveryone && !isEditing && (
          <div className="relative flex items-center">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="message-dropdown-button p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              title="Message options"
              aria-label="Message options"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-500 " />
            </button>

            {showDropdown && (
              <div className="message-dropdown-menu absolute bottom-full right-0 mb-1 bg-white shadow-lg rounded-lg py-1 min-w-max z-50 border border-gray-200">
                {message.messageType === "text" && (
                  <button
                    onClick={() => { setIsEditing(true); setShowDropdown(false); }}
                    className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <FiEdit3 className="inline mr-2" /> Edit message
                  </button>
                )}
                <button
                  onClick={() => handleDelete("me")}
                  className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <FiTrash2 className="inline mr-2" /> Delete for me
                </button>
                <button
                  onClick={() => handleDelete("everyone")}
                  className="block w-full px-3 py-1 text-sm text-red-600 hover:bg-gray-100 text-left"
                >
                  <FiTrash2 className="inline mr-2" /> Delete for everyone
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;