import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import socket from "../Socket/Socket.jsx";
import { Context } from "./context.jsx";
import { getAllChats, getChatMessages } from "./Api/User/Chat.js";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { verifyUser, userData } = useContext(Context);
  const { isVerify, isLoggedIn } = verifyUser;
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const token = localStorage.getItem("user_token");

  // Helper to emit socket events reliably
  const emitEvent = useCallback((event, payload) => {
    if (!payload || !socket) return;
    if (socket.connected) {
      socket.emit(event, payload);
    } else {
      socket.once("connect", () => socket.emit(event, payload));
      if (!socket.active) socket.connect(); // Ensure connection attempt
    }
  }, []);

  // Fetches all chats for the current user
  const fetchChats = useCallback(async () => {
    if (!localStorage.getItem("user_token")) return;
    try {
      const data = await getAllChats();
      if (data.statusCode === 200 && Array.isArray(data.data)) {
        const sortedChats = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setChats(sortedChats);
      } else {
        console.error("Failed to fetch chats:", data);
        setChats([]);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      setChats([]);
    }
  }, []);

  // Loads messages for a specific chat
  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      const data = await getChatMessages(chatId);
      if (data.statusCode === 200 || data.status === 200) {
        setMessages(data.data || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    }
  }, []);


  // Marks messages as seen
  const markSeen = useCallback(({ chatId, messageIds }) => {
    if (!chatId || !userData?._id || !Array.isArray(messageIds) || messageIds.length === 0) return;
    const unseenMessageIds = messageIds.filter(msgId => {
      const message = messages.find(m => m._id === msgId);
      return message && message.sender?._id !== userData._id && !message.seenBy?.some(user => user._id === userData._id);
    });

    if (unseenMessageIds.length > 0) {
      emitEvent("markSeen", { chatId, messageIds: unseenMessageIds, seenByUserId: userData._id });
    }
  }, [emitEvent, userData, messages]);

  // Sends a message via socket
  const sendMessage = async ({ chatId, messageType, message, file }) => {
    if (!chatId) throw new Error("chatId is required");

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    let contentValue = message;
    let fileNameValue = null;
    let durationValue = null;

    if (file) {
      contentValue = URL.createObjectURL(file);
      fileNameValue = file.name;
    }

    const optimisticMsg = {
      _id: tempId,
      tempId,
      chatId,
      sender: userData,
      messageType,
      content: contentValue,
      fileName: fileNameValue,
      duration: durationValue,
      seenBy: [{ _id: userData?._id }],
      deliveredTo: [{ _id: userData?._id }],
      createdAt: new Date().toISOString(),
      status: "sending",
      isOwn: true,
      isEdited: false,
      isDeletedForEveryone: false,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId
          ? { ...chat, lastMessage: optimisticMsg, updatedAt: optimisticMsg.createdAt }
          : chat
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );

    try {
      let base64File = null;
      if (file) {
        base64File = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      }

      // Emit sendMessage event via socket
      emitEvent("sendMessage", { chatId, messageType, message, file: base64File, tempId });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m)));
    }
  };

  // Creates a new chat (sends a socket event)
  const createChat = useCallback(async ({ jobId, applicationId, receiverId }) => {
    try {
      emitEvent("createChat", { jobId, applicationId, receiverId });
    } catch (error) {
      console.error("Failed to initiate chat creation via socket:", error);
    }
  }, [emitEvent]);

  // Edits an existing message
  const editMessage = (messageId, newContent) => {
    setMessages(prev => prev.map(msg =>
      msg._id === messageId ? { ...msg, content: newContent, isEdited: true, editedAt: new Date().toISOString() } : msg
    ));
    setChats(prev => prev.map(chat =>
      chat._id === activeChat._id && chat.lastMessage?._id === messageId
        ? { ...chat, lastMessage: { ...chat.lastMessage, content: newContent, isEdited: true, editedAt: new Date().toISOString() } }
        : chat
    ));
    emitEvent("editMessage", { messageId, newText: newContent, chatId: activeChat._id });
  };

  // Deletes a message (for self or everyone)
  const deleteMessage = (messageId, mode) => {
    setMessages(prev => prev.map(msg => {
      if (msg._id === messageId) {
        if (mode === "me") {
          return { ...msg, deletedFor: [...(msg.deletedFor || []), userData._id] };
        } else {
          return { ...msg, content: null, fileName: null, isDeletedForEveryone: true, messageType: 'text', deletedAt: new Date().toISOString() };
        }
      }
      return msg;
    }));

    setChats(prev => prev.map(chat => {
      if (chat._id === activeChat._id && chat.lastMessage?._id === messageId) {
        if (mode === "everyone") {
          return { ...chat, lastMessage: { ...chat.lastMessage, content: "Message deleted", isDeletedForEveryone: true, messageType: 'text' } };
        }
      }
      return chat;
    }));

    emitEvent("deleteMessage", { messageId, chatId: activeChat._id, mode });
  };

  // Deletes an entire chat
  const deleteChat = (chatId) => emitEvent("deleteChat", { chatId });

  // Sends typing status
  const sendTyping = (data) => emitEvent("typing", data);


  // Handles a new chat being 
  const handleChatCreated = useCallback(({ data }) => {
    setChats((prev) => {
      if (!Array.isArray(prev)) return [data];
      if (prev.some((c) => c._id === data._id)) return prev;
      return [data, ...prev];
    });
    setActiveChat(data);
    setMessages([]);
  }, []);

  // Handles a new message arriving
  const handleNewMessage = useCallback(({ data }) => {
    const { chatId, message: msg } = data;
    const enriched = {
      ...msg,
      content: msg.messageType === "text" ? msg.content : msg.mediaUrl,
      fileName: msg.fileName,
      duration: msg.duration,
      status: msg.status,
      isOwn: msg.sender?._id === userData?._id,
    };

    setMessages((prev) => {
      const existingIndex = prev.findIndex((m) => m.tempId === msg.tempId);

      if (existingIndex > -1) {
        const newMessages = [...prev];
        newMessages[existingIndex] = { ...enriched, tempId: undefined };
        return newMessages;
      } else {
        return [...prev, enriched];
      }
    });

    // Mark message as seen immediately if it's not from the current user and the chat is active
    if (chatId === activeChat?._id && msg.sender?._id !== userData?._id) {
      markSeen({ chatId: activeChat._id, messageIds: [msg._id] });
    }

    if (msg.sender?._id === userData?._id) {
      setIsTyping(false);
    }

    // Update last message in chat list and re-sort
    setChats((prev) => {
      if (!Array.isArray(prev)) return [];
      const updatedChats = prev.map((chat) =>
        chat._id === chatId ? {
          ...chat,
          lastMessage: {
            ...enriched,
            sender: msg.sender
          },
          unreadCount: chat.unreadCount + (msg.sender?._id !== userData?._id ? 1 : 0),
          updatedAt: msg.createdAt
        } : chat
      );
      return updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
  }, [activeChat, userData, markSeen]);

  // Handles a message being delivered (double checkmark)
  const handleMessageDelivered = useCallback(({ data }) => {
    const { chatId, messageId, deliveredToUserId } = data;

    setMessages((prev) =>
      prev.map((m) => {
        if (m._id === messageId) {
          const updatedDeliveredTo = m.deliveredTo ? [...m.deliveredTo] : [];
          if (!updatedDeliveredTo.some(user => user._id === deliveredToUserId)) {
            updatedDeliveredTo.push({ _id: deliveredToUserId });
          }
          return {
            ...m,
            deliveredTo: updatedDeliveredTo,
            status: m.status === "sending" ? "delivered" : m.status,
          };
        }
        return m;
      })
    );

    setChats((prev) =>
      Array.isArray(prev)
        ? prev.map((chat) =>
          chat._id === chatId && chat.lastMessage?._id === messageId
            ? {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                deliveredTo: chat.lastMessage.deliveredTo ? [...chat.lastMessage.deliveredTo, { _id: deliveredToUserId }] : [{ _id: deliveredToUserId }],
                status: chat.lastMessage.status === "sending" ? "delivered" : chat.lastMessage.status,
              },
            }
            : chat
        )
        : []
    );
  }, []);

  // Handles an edited message
  const handleMessageEdited = useCallback(({ data }) => {
    const msg = data.message;
    setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, content: msg.content, isEdited: true, editedAt: msg.editedAt } : m)));
    setChats((prev) =>
      Array.isArray(prev)
        ? prev.map((chat) =>
          chat._id === data.chatId && chat.lastMessage?._id === msg._id
            ? { ...chat, lastMessage: { ...chat.lastMessage, content: msg.content, isEdited: true, editedAt: msg.editedAt } }
            : chat
        )
        : []
    );
  }, []);

  // Handles a deleted message
  const handleMessageDeleted = useCallback(({ data }) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._id === data.messageId
          ? { ...m, content: data.mode === "everyone" ? null : m.content, fileName: data.mode === "everyone" ? null : m.fileName, isDeletedForEveryone: data.mode === "everyone", messageType: data.mode === "everyone" ? 'text' : m.messageType, deletedAt: data.deletedAt, deletedFor: data.mode === "me" ? [...(m.deletedFor || []), data.userId] : [] }
          : m
      )
    );
    setChats((prev) =>
      Array.isArray(prev)
        ? prev.map((chat) =>
          chat._id === data.chatId && chat.lastMessage?._id === data.messageId
            ? { ...chat, lastMessage: { ...chat.lastMessage, content: data.mode === "everyone" ? "Message deleted" : chat.lastMessage.content, isDeletedForEveryone: data.mode === "everyone" ? 'text' : chat.lastMessage.messageType } }
            : chat
        )
        : []
    );
  }, []);

  // Handles messages being marked as seen
  const handleMessagesSeen = useCallback(({ data }) => {
    if (!Array.isArray(data.messageIds)) return;
    setMessages((prev) =>
      prev.map((m) => {
        if (data.messageIds.includes(m._id)) {
          const updatedSeenBy = m.seenBy ? [...m.seenBy] : [];
          if (!updatedSeenBy.some(user => user._id === data.seenByUserId)) {
            updatedSeenBy.push({ _id: data.seenByUserId });
          }
          return {
            ...m,
            seenBy: updatedSeenBy,
            status: "seen",
          };
        }
        return m;
      })
    );
    // Reset unread count for the active chat
    if (activeChat?._id === data.chatId) {
      setChats(prev => prev.map(chat => chat._id === data.chatId ? { ...chat, unreadCount: 0 } : chat));
    }
  }, [activeChat]);

  // Handles a chat being deleted
  const handleChatDeleted = useCallback(({ data }) => {
    setChats((prev) => (Array.isArray(prev) ? prev.filter((c) => c._id !== data.chatId) : []));
    if (activeChat?._id === data.chatId) {
      setActiveChat(null);
      setMessages([]);
    }
  }, [activeChat]);

  // Handles typing indicator updates
  const handleTyping = useCallback(({ chatId, userId, isTyping }) => {
    if (chatId === activeChat?._id && userId !== userData?._id) {
      setIsTyping(isTyping);
    }
  }, [activeChat, userData]);

  // Handles user online/offline status updates
  const handleUserStatusUpdate = useCallback(({ userId, isOnline, lastSeen }) => {
    setChats((prev) =>
      Array.isArray(prev)
        ? prev.map((chat) => {
          // Find the participant in the chat (sender or receiver)
          const participant = chat.sender._id === userId ? chat.sender : chat.receiver._id === userId ? chat.receiver : null;
          if (participant) {
            // Create a new chat object with updated participant status
            if (chat.sender._id === userId) {
              return { ...chat, sender: { ...chat.sender, isOnline, lastSeen } };
            } else if (chat.receiver._id === userId) {
              return { ...chat, receiver: { ...chat.receiver, isOnline, lastSeen } };
            }
          }
          return chat;
        })
        : []
    );
    // Also update active chat user's online status if applicable
    setActiveChat((prev) => {
      if (!prev) return null;
      const otherUser = prev.sender._id === userData?._id ? prev.receiver : prev.sender;
      if (otherUser._id === userId) {
        return { ...prev, receiver: { ...otherUser, isOnline, lastSeen } };
      }
      return prev;
    });
  }, [userData]);

  // Main Socket Connection 
  useEffect(() => {

    if (isVerify && isLoggedIn && token && !socket.connected) {
      console.log("Attempting to connect socket...");
      socket.auth = { token };
      socket.connect();

      // Use socket.off().on() chaining to ensure listeners are replaced, not duplicated.
      socket.off("connect").on("connect", () => {
        console.log("✅ Socket connected");
        fetchChats();
        emitEvent("user:online", { userId: userData?._id, isOnline: true });
      });

      socket.off("disconnect").on("disconnect", (reason) => console.log("Socket disconnected:", reason));
      socket.off("chatCreated").on("chatCreated", handleChatCreated);
      socket.off("message:new").on("message:new", handleNewMessage);
      socket.off("message:delivered").on("message:delivered", handleMessageDelivered);
      socket.off("message:edited").on("message:edited", handleMessageEdited);
      socket.off("message:deleted").on("message:deleted", handleMessageDeleted);
      socket.off("messages:seen").on("messages:seen", handleMessagesSeen);
      socket.off("chat:deleted").on("chat:deleted", handleChatDeleted);
      socket.off("typing").on("typing", handleTyping);
      socket.off("user:online").on("user:online", handleUserStatusUpdate);
      socket.off("user:offline").on("user:offline", handleUserStatusUpdate);
      socket.off("errorMessage").on("errorMessage", (err) => console.error("⚠️ Socket error:", err));
      socket.off("connect_error").on("connect_error", (err) => console.error("❌ Connection error:", err.message));

    } else if ((!isVerify || !isLoggedIn || !token) && socket.connected) {
      // Disconnect socket if user logs out or token becomes invalid
      console.log("Attempting to disconnect socket due to auth change...");
      emitEvent("user:offline", { userId: userData?._id, lastSeen: new Date().toISOString() }); // Announce offline status
      socket.disconnect();
      setChats([]);
      setActiveChat(null);
      setMessages([]);
    }

    return () => {
      if (socket.connected || socket.active) {
        console.log("Cleaning up socket listeners...");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("chatCreated");
        socket.off("message:new");
        socket.off("message:delivered");
        socket.off("message:edited");
        socket.off("message:deleted");
        socket.off("messages:seen");
        socket.off("chat:deleted");
        socket.off("typing");
        socket.off("user:online");
        socket.off("user:offline");
        socket.off("errorMessage");
        socket.off("connect_error");
      }
    };
  }, [isVerify, isLoggedIn, token, userData?._id, fetchChats, emitEvent,]);

  // Handle mobile view based on window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <ChatContext.Provider
      value={{
        chats, setChats, activeChat, setActiveChat, messages, setMessages,
        isTyping, setIsTyping, isMobile, fetchChats, loadMessages, createChat, sendMessage,
        editMessage, deleteMessage, markSeen, deleteChat, sendTyping, userData
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
