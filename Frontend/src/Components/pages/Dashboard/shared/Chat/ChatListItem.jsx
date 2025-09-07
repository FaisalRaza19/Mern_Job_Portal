import { useChat } from "../../../../../Context/chatContext.jsx";
import { FiCheck, FiCheckCircle, FiMic, FiImage, FiVideo, FiFile, FiVolume2, FiTrash2, FiClock } from "react-icons/fi";

const ChatListItem = ({ chat, currentUserId, onDeleteChat }) => {
  const { activeChat, setActiveChat } = useChat();

  const otherUser = chat.sender._id === currentUserId ? chat.receiver : chat.sender;
  const isActive = activeChat?._id === chat._id;

  const name = otherUser?.jobSeekerInfo?.fullName || otherUser?.companyInfo?.companyName || "Unknown User";
  const avatar = otherUser?.avatar?.avatar_Url || "/placeholder.svg?height=48&width=48";
  const isOnline = otherUser?.isOnline;

  // Formats timestamp for display in chat list
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Generates a preview text/icon for the last message
  const getMessagePreview = () => {
    if (!chat.lastMessage) return "No messages yet";

    const msg = chat.lastMessage;
    const isOwn = msg.sender?._id === currentUserId;
    const prefix = isOwn ? "You: " : "";

    if (msg.isDeletedForEveryone) {
      return (
        <div className="flex items-center space-x-1 italic text-gray-500 ">
          <FiTrash2 className="w-3 h-3" />
          <span>{prefix}This message was deleted</span>
        </div>
      );
    }

    switch (msg.messageType) {
      case "text":
        return `${prefix}${msg.content}`;
      case "voice":
        return (
          <div className="flex items-center space-x-1">
            <FiMic className="w-3 h-3" />
            <span>{prefix}Voice message</span>
          </div>
        );
      case "image":
        return (
          <div className="flex items-center space-x-1">
            <FiImage className="w-3 h-3" />
            <span>{prefix}Photo</span>
          </div>
        );
      case "video":
        return (
          <div className="flex items-center space-x-1">
            <FiVideo className="w-3 h-3" />
            <span>{prefix}Video</span>
          </div>
        );
      case "audio":
        return (
          <div className="flex items-center space-x-1">
            <FiVolume2 className="w-3 h-3" />
            <span>{prefix}Audio</span>
          </div>
        );
      case "file":
        return (
          <div className="flex items-center space-x-1">
            <FiFile className="w-3 h-3" />
            <span>{prefix}File</span>
          </div>
        );
      default:
        return `${prefix}${msg.content}`;
    }
  };

  // Determines the message status icon (sent, delivered, seen)
  const getMessageStatus = () => {
    if (!chat.lastMessage || chat.lastMessage.sender?._id !== currentUserId) return null;

    const msg = chat.lastMessage;
    // Check if current user's ID is present in seenBy array (excluding self)
    const hasBeenSeenByOther = msg.seenBy?.some(user => user._id === otherUser._id);
    // Check if current user's ID is present in deliveredTo array (excluding self)
    const hasBeenDeliveredToOther = msg.deliveredTo?.some(user => user._id === otherUser._id);

    if (hasBeenSeenByOther) {
      return <FiCheckCircle className="w-4 h-4 text-blue-500" />;
    }
    if (hasBeenDeliveredToOther) {
      return (
        <span className="relative">
          <FiCheck className="w-4 h-4 text-gray-500 absolute left-0 top-0" />
          <FiCheck className="w-4 h-4 text-gray-500 absolute left-2 top-0" />
        </span>
      );
    }
    if (msg.status === "sending") {
      return <FiClock className="w-4 h-4 text-gray-400 animate-pulse" />;
    }
    return <FiCheck className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div
      className={`relative group flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isActive ? "bg-green-50 border-r-4 border-green-500" : ""
        } rounded-md mx-2 my-1`}
      onClick={() => setActiveChat(chat)}
      role="button"
      tabIndex={0}
      aria-label={`Open chat with ${name}`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.svg?height=48&width=48";
          }}
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
          <div className="flex items-center space-x-1">
            {getMessageStatus()}
            <span className="text-xs text-gray-500  ml-1">
              {chat.lastMessage && formatTime(chat.lastMessage.createdAt)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat();
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity duration-200"
              title="Delete chat"
              aria-label={`Delete chat with ${name}`}
            >
              <FiTrash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 truncate flex-1 mr-2">{getMessagePreview()}</div>

          {/* Unread count badge */}
          {chat.unreadCount > 0 && (
            <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold">
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
