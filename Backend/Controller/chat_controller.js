import { Chat } from "../Models/chat_model.js"
import { Job } from "../Models/job_model.js"
import { User } from "../Models/user_model.js"
import { fileUploadOnCloudinary, removeFileFromCloudinary } from "../utility/fileUpload_remove.js"
import mongoose from "mongoose"

// Create a new chat conversation
const handleCreateChat = async (socket, data, io) => {
    try {
        const { jobId, applicationId, receiverId } = data
        const senderId = socket?.user?.id

        if (!jobId || !applicationId || !receiverId) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Missing required chat creation data." })
        }

        // Validate job and employer
        const job = await Job.findById(jobId)
        if (!job) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Job not found." })
        }
        if (!job.company.equals(senderId)) {
            return socket.emit("errorMessage", {
                statusCode: 400,
                message: "Only the employer associated with this job can initiate the chat.",
            })
        }

        // Check if receiver exists and is a jobseeker
        const receiver = await User.findById(receiverId)
        if (!receiver || receiver.role !== "jobseeker") {
            return socket.emit("errorMessage", { statusCode: 400, message: "Receiver user is not valid." })
        }

        // Prevent duplicate chat
        const existingChat = await Chat.findOne({
            jobId,
            applicationId,
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        })

        if (existingChat) {
            const populatedChat = await Chat.findById(existingChat.id)
                .populate({
                    path: "sender",
                    select: "role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen",
                })
                .populate({
                    path: "receiver",
                    select: "role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen",
                })

            return socket.emit("chatCreated", {
                statusCode: 200,
                message: "Chat already exists.",
                data: populatedChat,
            })
        }

        // Create new chat conversation
        const newChat = new Chat({
            jobId,
            applicationId,
            sender: senderId,
            receiver: receiverId,
            messages: [],
        })

        await newChat.save()

        // Populate sender and receiver details for the emitted chat object
        const populatedNewChat = await Chat.findById(newChat.id)
            .populate({
                path: "sender",
                select: "role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen",
            })
            .populate({
                path: "receiver",
                select: "role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen",
            })

        // Emit 'chatCreated' event to both participants
        io.to(senderId.toString()).emit("chatCreated", {
            statusCode: 201,
            message: "Chat created successfully.",
            data: populatedNewChat,
        })
        io.to(receiverId.toString()).emit("chatCreated", {
            statusCode: 201,
            message: "Chat created successfully.",
            data: populatedNewChat,
        })
    } catch (error) {
        console.error("handleCreateChat error:", error)
        socket.emit("errorMessage", { statusCode: 500, message: "Failed to create chat." })
    }
}

// Send a new message in a chat
const handleSendMessage = async (socket, data, io) => {
    try {
        const { chatId, messageType, message, file, tempId } = data // 'file' now contains the base64 string
        const senderId = socket?.user?.id

        if (!chatId || !messageType || (messageType === "text" && !message?.trim()) || (["image", "video", "audio", "voice", "file"].includes(messageType) && !file)
        ) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Missing required message data or file." })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) {
            return socket.emit("errorMessage", { statusCode: 404, message: "Chat not found." })
        }

        // Ensure sender is a participant
        if (![chat.sender.toString(), chat.receiver.toString()].includes(senderId.toString())) {
            return socket.emit("errorMessage", { statusCode: 403, message: "You are not a participant of this chat." })
        }

        let mediaUrl = null
        let fileName = null
        let duration = null

        // Handle media file if present
        if (["image", "video", "audio", "voice", "file"].includes(messageType) && file) {
            try {
                const matches = file.match(/^data:(.+);base64,(.+)$/)
                if (!matches || matches.length !== 3) {
                    throw new Error("Invalid base64 format.")
                }

                const mimeType = matches[1]
                const fileExtension = mimeType.split("/")[1]

                // Removed: console.log(buffer) - This was the problematic line
                // Removed: console.log("2", uploadResult) - This was also problematic if uploadResult contained the full Base64 string

                const folder = "Job Portal/Chat Media"
                const resourceType =
                    messageType === "image"
                        ? "image"
                        : messageType === "video" || messageType === "audio" || messageType === "voice"
                            ? "video"
                            : "raw"

                // Pass the full Data URI (base64 string) directly to fileUploadOnCloudinary
                const uploadResult = await fileUploadOnCloudinary(file, folder, resourceType)
                // If you still need to log something, log specific properties like uploadResult.secure_url or uploadResult.public_id
                // console.log("Cloudinary upload successful:", uploadResult.secure_url);


                mediaUrl = {
                    media_Url: uploadResult.secure_url, // Use secure_url as it's more reliable
                    media_PublicId: uploadResult.public_id,
                    media_Name: uploadResult.original_filename || `file.${fileExtension}`,
                }

                fileName = uploadResult.original_filename

                // For voice messages, extract duration if available
                if (messageType === "voice" || messageType === "audio" && uploadResult.duration) {
                    duration = uploadResult.duration
                }
            } catch (err) {
                console.error("Cloudinary upload error:", err)
                return socket.emit("errorMessage", { statusCode: 500, message: "Failed to upload file." })
            }
        }

        // Message Object
        const newMessage = {
            sender: senderId,
            messageType,
            message: messageType === "text" ? message.trim() : null,
            mediaUrl,
            duration: duration,
            seenBy: [senderId], // Sender has seen it immediately
            deliveredTo: [senderId], // Sender has delivered to self immediately
            createdAt: new Date(),
        }

        chat.messages.push(newMessage)
        chat.lastActivity = new Date()
        await chat.save()

        const sentMessage = chat.messages[chat.messages.length - 1]

        // Populate sender details for the emitted message
        const senderUser = await User.findById(senderId).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen")
        const receiverUser = await User.findById(chat.receiver._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen")


        const participants = [
            { id: chat.sender._id.toString(), user: senderUser },
            { id: chat.receiver._id.toString(), user: receiverUser }
        ];

        // Emit 'message:new' to both participants
        participants.forEach(({ id, user }) => {
            const isReceiver = id !== senderId.toString();
            io.to(id).emit("message:new", {
                statusCode: 200,
                message: "New message received.",
                data: {
                    chatId,
                    message: {
                        _id: sentMessage._id,
                        tempId: tempId || sentMessage._id, // Echo back tempId if present, otherwise use real _id
                        sender: senderUser, // Send populated sender object
                        messageType: sentMessage.messageType,
                        content: sentMessage.messageType === "text" ? sentMessage.message : sentMessage.mediaUrl?.media_Url,
                        fileName: sentMessage.mediaUrl?.media_Name,
                        duration: sentMessage.duration,
                        seenBy: sentMessage.seenBy.map(id => ({ _id: id })), // Convert to array of objects for frontend consistency
                        deliveredTo: sentMessage.deliveredTo.map(id => ({ _id: id })), // Convert to array of objects for frontend consistency
                        createdAt: sentMessage.createdAt,
                        isEdited: sentMessage.edited || false,
                        isDeletedForEveryone: sentMessage.isDeletedForEveryone || false,
                        status: isReceiver ? "delivered" : "sent", // Initial status for receiver is 'delivered', for sender is 'sent'
                    },
                },
            });
        });


        // Mark message as delivered to receiver (if not already seen)
        const receiverId = participants.find((p) => p.id !== senderId.toString())?.id;
        if (receiverId) {
            // Check if receiver is online to mark as delivered
            const receiverSocketId = io.sockets.adapter.rooms.get(receiverId)?.values().next().value;
            if (receiverSocketId) {
                // If receiver is online, mark as delivered immediately
                if (!sentMessage.deliveredTo.includes(receiverId)) {
                    sentMessage.deliveredTo.push(receiverId)
                    await chat.save()
                }

                // Emit 'message:delivered' to both participants
                participants.forEach(({ id }) => {
                    io.to(id).emit("message:delivered", {
                        statusCode: 200,
                        data: {
                            chatId,
                            messageId: sentMessage._id,
                            deliveredToUserId: receiverId,
                        },
                    });
                });
            }
        }
    } catch (error) {
        console.error("💥 Send message error:", error)
        socket.emit("errorMessage", {
            statusCode: 500,
            message: "Failed to send message.",
        })
    }
}

// Edit an existing message
const handleEditMessage = async (socket, data, io) => {
    try {
        const { chatId, messageId, newText } = data
        const userId = socket?.user?.id

        if (!chatId || !messageId || typeof newText !== "string" || newText.trim() === "") {
            return socket.emit("errorMessage", { statusCode: 400, message: "Missing required data for message edit." })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Chat not found." })
        }

        const message = chat.messages.id(messageId)
        if (!message) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Message not found." })
        }

        if (message.sender.toString() !== userId.toString()) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Not authorized to edit this message." })
        }

        if (message.messageType !== "text") {
            return socket.emit("errorMessage", { statusCode: 400, message: "Only text messages can be edited." })
        }

        message.message = newText.trim()
        message.edited = true
        message.editedAt = new Date()
        await chat.save()

        // Get the updated message to send back
        const updatedMessage = chat.messages.id(messageId)

        // Populate sender details for the emitted message
        const senderUser = await User.findById(message.sender).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen")
        const receiverUser = await User.findById(chat.receiver._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen")

        const participants = [
            { id: chat.sender._id.toString(), user: senderUser },
            { id: chat.receiver._id.toString(), user: receiverUser }
        ];

        // Emit 'message:edited' event to both participants
        participants.forEach(({ id }) => {
            io.to(id).emit("message:edited", {
                statusCode: 200,
                message: "Message edited successfully.",
                data: {
                    chatId,
                    message: {
                        _id: updatedMessage._id,
                        sender: senderUser, // Send populated sender object
                        messageType: updatedMessage.messageType,
                        content: updatedMessage.message,
                        seenBy: updatedMessage.seenBy.map(id => ({ _id: id })),
                        deliveredTo: updatedMessage.deliveredTo.map(id => ({ _id: id })),
                        createdAt: updatedMessage.createdAt,
                        editedAt: updatedMessage.editedAt,
                        isEdited: updatedMessage.edited,
                        isDeletedForEveryone: updatedMessage.isDeletedForEveryone,
                    },
                },
            })
        })
    } catch (err) {
        console.error("💥 Edit message error:", err)
        socket.emit("errorMessage", {
            statusCode: 500,
            message: "Failed to edit message.",
        })
    }
}

// Delete a message for 'me' or 'everyone'
const handleDeleteMessage = async (socket, data, io) => {
    try {
        const { chatId, messageId, mode } = data
        const userId = socket?.user?.id

        if (!chatId || !messageId || !["me", "everyone"].includes(mode)) {
            return socket.emit("errorMessage", {
                statusCode: 400,
                message: "Missing required data or invalid mode for message delete.",
            })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Chat not found." })
        }

        const message = chat.messages.id(messageId)
        if (!message) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Message not found." })
        }

        // Only the sender can delete the message
        if (message.sender.toString() !== userId) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Not authorized to delete this message." })
        }

        if (mode === "me") {
            if (!message.deletedFor.includes(userId)) {
                message.deletedFor.push(userId)
            }
        } else if (mode === "everyone") {
            if (message.mediaUrl && message.mediaUrl.media_PublicId) {
                try {
                    let resourceType = "auto"
                    if (message.messageType === "image") resourceType = "image"
                    else if (
                        message.messageType === "video" ||
                        message.messageType === "audio" ||
                        message.messageType === "voice"
                    )
                        resourceType = "video"
                    else if (message.messageType === "file") resourceType = "raw"

                    await removeFileFromCloudinary(message.mediaUrl.media_PublicId, resourceType)
                } catch (cloudErr) {
                    console.error("Cloudinary delete error (safe to ignore if file already gone):", cloudErr)
                }
            }

            message.message = null
            message.mediaUrl = null
            message.isDeletedForEveryone = true
            message.deletedFor = [] // Clear deletedFor for 'everyone' mode
            message.deletedAt = new Date()
        }

        await chat.save()

        // Populate sender and receiver for consistent data
        const senderUser = await User.findById(chat.sender._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");
        const receiverUser = await User.findById(chat.receiver._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");

        const participants = [
            { id: chat.sender._id.toString(), user: senderUser },
            { id: chat.receiver._id.toString(), user: receiverUser }
        ];

        participants.forEach(({ id }) => {
            io.to(id).emit("message:deleted", {
                statusCode: 200,
                message: "Message deletion processed.",
                data: {
                    chatId,
                    messageId,
                    mode,
                    userId,
                    deletedAt: message.deletedAt,
                    // Send updated message content for 'everyone' mode
                    message: mode === "everyone" ? {
                        _id: message._id,
                        sender: senderUser,
                        messageType: 'text', // Changed to text for deleted message placeholder
                        content: null,
                        fileName: null,
                        duration: null,
                        isDeletedForEveryone: true,
                        seenBy: message.seenBy.map(id => ({ _id: id })),
                        deliveredTo: message.deliveredTo.map(id => ({ _id: id })),
                        createdAt: message.createdAt,
                        edited: message.edited,
                        editedAt: message.editedAt,
                        deletedFor: message.deletedFor.map(id => ({ _id: id })),
                        deletedAt: message.deletedAt,
                    } : null, // Only send full message if deleted for everyone
                },
            })
        })
    } catch (err) {
        console.error("💥 Delete message error:", err)
        socket.emit("errorMessage", {
            statusCode: 500,
            message: "Failed to delete message.",
        })
    }
}

// Mark messages as seen by the current user
const handleMarkMessagesSeen = async (socket, data, io) => {
    try {
        const { chatId, messageIds } = data
        const userId = socket?.user?.id

        if (!chatId || !Array.isArray(messageIds) || messageIds.length === 0) {
            return socket.emit("errorMessage", {
                statusCode: 400,
                message: "Missing required data for marking messages seen.",
            })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) {
            return socket.emit("errorMessage", {
                statusCode: 404,
                message: "Chat not found.",
            })
        }

        // Check if the user is a participant
        const isParticipant = chat.sender.toString() === userId || chat.receiver.toString() === userId

        if (!isParticipant) {
            return socket.emit("errorMessage", {
                statusCode: 403,
                message: "You are not a participant of this chat.",
            })
        }

        let changesMade = false

        for (const msgId of messageIds) {
            const msg = chat.messages.find((m) => m._id.toString() === msgId && m.sender.toString() !== userId)
            if (msg) {
                if (!Array.isArray(msg.seenBy)) msg.seenBy = []
                if (!msg.seenBy.includes(userId)) {
                    msg.seenBy.push(userId)
                    msg.seenAt = new Date() // Set seenAt when message is marked seen
                    changesMade = true
                }
            }
        }

        if (!changesMade) {
            return socket.emit("info", {
                statusCode: 200,
                message: "No new messages marked as seen.",
            })
        }

        await chat.save()

        // Populate sender and receiver for consistent data
        const senderUser = await User.findById(chat.sender._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");
        const receiverUser = await User.findById(chat.receiver._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");

        const participants = [
            { id: chat.sender._id.toString(), user: senderUser },
            { id: chat.receiver._id.toString(), user: receiverUser }
        ];

        participants.forEach(({ id }) => {
            io.to(id).emit("messages:seen", {
                statusCode: 200,
                message: "Messages marked as seen.",
                data: {
                    chatId,
                    messageIds,
                    seenByUserId: userId,
                    seenAt: new Date(),
                },
            })
        })
    } catch (error) {
        console.error("💥 handleMarkMessagesSeen error:", error)
        socket.emit("errorMessage", {
            statusCode: 500,
            message: "Failed to mark messages seen.",
        })
    }
}

// Get all chats
const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id

        const chats = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate({
                path: "sender",
                select: "role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen",
            })
            .populate({
                path: "receiver",
                select: "role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen",
            })
            .sort({ lastActivity: -1, updatedAt: -1 })

        // Add unread count and last message info
        const enrichedChats = chats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1]
            const unreadCount = chat.messages.filter(
                (msg) => msg.sender.toString() !== userId.toString() && !msg.seenBy.includes(userId),
            ).length

            return {
                ...chat.toObject(),
                lastMessage: lastMessage
                    ? {
                        _id: lastMessage._id,
                        messageType: lastMessage.messageType,
                        content:
                            lastMessage.messageType === "text"
                                ? lastMessage.message
                                : lastMessage.mediaUrl?.media_Url,
                        fileName: lastMessage.mediaUrl?.media_Name,
                        duration: lastMessage.duration,
                        createdAt: lastMessage.createdAt,
                        sender: lastMessage.sender, // This will be just the ID, frontend will populate
                        isDeletedForEveryone: lastMessage.isDeletedForEveryone,
                        seenBy: lastMessage.seenBy.map(id => ({ _id: id })), // Ensure seenBy is array of objects
                        deliveredTo: lastMessage.deliveredTo.map(id => ({ _id: id })), // Ensure deliveredTo is array of objects
                    }
                    : null,
                unreadCount,
            }
        })

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Chats fetched successfully.",
            data: enrichedChats,
        })
    } catch (error) {
        console.error("getAllChats error:", error)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to fetch chats.",
        })
    }
}

// Get messages for specific chat
const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.user._id
        const { page = 1, limit = 50 } = req.query

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ statusCode: 400, success: false, message: "Invalid chat ID." })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) {
            return res.status(400).json({ statusCode: 400, success: false, message: "Chat not found." })
        }

        // Ensure user is a participant of the chat
        if (chat.sender.toString() !== userId.toString() && chat.receiver.toString() !== userId.toString()) {
            return res
                .status(400)
                .json({ statusCode: 400, success: false, message: "You are not authorized to view this chat." })
        }

        // Filter messages that are deleted for the current user
        const filteredMessages = chat.messages.filter((msg) => !msg.deletedFor.includes(userId.toString()))

        // Implement pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + Number.parseInt(limit)
        const paginatedMessages = filteredMessages.slice(startIndex, endIndex)

        // Populate sender for each message
        const formattedMessages = await Promise.all(paginatedMessages.map(async (msg) => {
            const senderUser = await User.findById(msg.sender).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");
            return {
                _id: msg._id,
                sender: senderUser,
                messageType: msg.messageType,
                content: msg.messageType === "text" ? msg.message : msg.mediaUrl?.media_Url,
                fileName: msg.mediaUrl?.media_Name,
                duration: msg.duration,
                seenBy: msg.seenBy.map(id => ({ _id: id })),
                deliveredTo: msg.deliveredTo.map(id => ({ _id: id })),
                createdAt: msg.createdAt,
                editedAt: msg.editedAt,
                isEdited: msg.edited,
                isDeletedForEveryone: msg.isDeletedForEveryone,
            };
        }));


        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Messages fetched successfully.",
            data: formattedMessages,
            pagination: {
                currentPage: Number.parseInt(page),
                totalMessages: filteredMessages.length,
                hasMore: endIndex < filteredMessages.length,
            },
        })
    } catch (error) {
        console.error("getChatMessages error:", error)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Failed to fetch messages for chat.",
        })
    }
}

// Delete an entire chat conversation
const handleDeleteChat = async (socket, data, io) => {
    try {
        const { chatId } = data
        const userId = socket?.user?.id

        if (!chatId) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Chat ID is required for deletion." })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Chat not found." })
        }

        // Verify user is a participant of this chat before allowing deletion
        if (!chat.sender.equals(userId) && !chat.receiver.equals(userId)) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Not authorized to delete this chat." })
        }

        // Delete all associated media files from Cloudinary before deleting the chat
        for (const message of chat.messages) {
            if (message.mediaUrl && message.mediaUrl.media_PublicId && !message.isDeletedForEveryone) {
                try {
                    let resourceType = "auto"
                    if (message.messageType === "image") resourceType = "image"
                    else if (
                        message.messageType === "video" ||
                        message.messageType === "audio" ||
                        message.messageType === "voice"
                    )
                        resourceType = "video"
                    else if (message.messageType === "file") resourceType = "raw"

                    await removeFileFromCloudinary(message.mediaUrl.media_PublicId, resourceType)
                } catch (cloudErr) {
                    console.error("Cloudinary delete error (safe to ignore if file already gone):", cloudErr)
                }
            }
        }

        await chat.deleteOne()

        // Populate sender and receiver for consistent data
        const senderUser = await User.findById(chat.sender._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");
        const receiverUser = await User.findById(chat.receiver._id).select("role avatar.avatar_Url companyInfo.companyName jobSeekerInfo.fullName isOnline lastSeen");

        const participants = [
            { id: chat.sender._id.toString(), user: senderUser },
            { id: chat.receiver._id.toString(), user: receiverUser }
        ];

        participants.forEach(({ id }) => {
            io.to(id).emit("chat:deleted", {
                statusCode: 200,
                message: "Chat deleted successfully.",
                data: { chatId },
            })
        })
    } catch (error) {
        console.error("handleDeleteChat error:", error)
        socket.emit("errorMessage", {
            statusCode: 500,
            message: "Failed to delete chat.",
        })
    }
}

// Handle typing status updates
const handleTyping = async (socket, data, io) => {
    try {
        const { chatId, isTyping } = data
        const userId = socket?.user?.id

        if (!chatId) {
            return socket.emit("errorMessage", { statusCode: 400, message: "Missing required data for typing status." })
        }

        const chat = await Chat.findById(chatId)
        if (!chat) return // emit to the other participant
            ;[chat.sender, chat.receiver].forEach((uid) => {
                if (uid.toString() !== userId.toString()) {
                    io.to(uid.toString()).emit("typing", {
                        statusCode: 200,
                        chatId,
                        userId: userId.toString(),
                        isTyping,
                    })
                }
            })
    } catch (error) {
        console.error("💥 Typing event error:", error)
    }
}

// Handle user online status
const handleUserOnline = async (socket, data, io) => {
    try {
        const userId = socket?.user?.id
        if (!userId) return

        // Update user online status
        await User.findByIdAndUpdate(userId, {
            isOnline: true,
            lastSeen: new Date(),
        })

        // Notify all chat participants about online status
        const userChats = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })

        const notifyUsers = new Set()
        userChats.forEach((chat) => {
            const otherUserId = chat.sender.toString() === userId ? chat.receiver : chat.sender
            notifyUsers.add(otherUserId.toString())
        })

        notifyUsers.forEach((uid) => {
            io.to(uid).emit("user:online", {
                userId,
                isOnline: true,
                lastSeen: new Date(),
            })
        })
    } catch (error) {
        console.error("💥 User online error:", error)
    }
}

// Handle user offline status
const handleUserOffline = async (socket, io) => {
    try {
        const userId = socket?.user?.id
        if (!userId) return

        // Update user offline status
        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
        })

        // Notify all chat participants about offline status
        const userChats = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })

        const notifyUsers = new Set()
        userChats.forEach((chat) => {
            const otherUserId = chat.sender.toString() === userId ? chat.receiver : chat.sender
            notifyUsers.add(otherUserId.toString())
        })

        notifyUsers.forEach((uid) => {
            io.to(uid).emit("user:offline", {
                userId,
                isOnline: false,
                lastSeen: new Date(),
            })
        })
    } catch (error) {
        console.error("💥 User offline error:", error)
    }
}

export {
    handleCreateChat, handleSendMessage, handleTyping, handleEditMessage, handleDeleteMessage, handleMarkMessagesSeen,
    getAllChats, handleDeleteChat, getChatMessages, handleUserOnline, handleUserOffline,
}
