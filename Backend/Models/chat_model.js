import mongoose from "mongoose"

const messageSchema = {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "video", "voice", "audio", "file"],
        required: true,
    },
    message: {
        type: String,
    },
    mediaUrl: {
        media_Url: String,
        media_PublicId: String,
        media_Name: String,
    },
    duration: {
        type: Number,
        default: null,
    },
    deletedFor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    isDeletedForEveryone: {
        type: Boolean,
        default: false,
    },
    edited: {
        type: Boolean,
        default: false,
    },
    editedAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    deliveredTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    seenAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}

const ChatMessageSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        messages: [messageSchema],
        lastActivity: {
            type: Date,
            default: Date.now,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        archivedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
    },
    {
        timestamps: true,
    },
)

// Index for better query performance
ChatMessageSchema.index({ sender: 1, receiver: 1 })
ChatMessageSchema.index({ jobId: 1, applicationId: 1 })
ChatMessageSchema.index({ lastActivity: -1 })

export const Chat = mongoose.model("chat", ChatMessageSchema)
