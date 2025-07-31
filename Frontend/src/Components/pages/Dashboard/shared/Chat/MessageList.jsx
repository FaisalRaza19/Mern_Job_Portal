import React from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId }) => {
  // Groups messages by date for date headers
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  // Formats date for the header (Today, Yesterday, or full date)
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    if (normalizeDate(date) === normalizeDate(today)) {
      return "Today";
    } else if (normalizeDate(date) === normalizeDate(yesterday)) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="space-y-4">
      {/* Render message groups in chronological order (oldest first) */}
      {Object.entries(messageGroups)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()) 
        .map(([date, groupMessages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4 sticky top-0 z-10 py-2">
              <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{formatDateHeader(date)}</span>
              </div>
            </div>

            {/* Messages within each date group */}
            <div className="space-y-2">
              {groupMessages.map((message, index) => {
                const prevMessage = index > 0 ? groupMessages[index - 1] : null;
                const nextMessage = index < groupMessages.length - 1 ? groupMessages[index + 1] : null;

                // Determine if this is the first/last message in a consecutive group from the same sender
                const isFirstInGroup = !prevMessage || prevMessage.sender._id !== message.sender._id;
                const isLastInGroup = !nextMessage || nextMessage.sender._id !== message.sender._id;

                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={message.sender._id === currentUserId}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                  />
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MessageList;
