import express from "express"
import session from "express-session"
import connectToDb from "./DataBase/db.js"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import MongoStore from "connect-mongo";

// routes
import { router as userRoutes } from "./Routes/user.route.js"
import { route as jobRoutes } from "./Routes/jobs.routes.js"
import { review as reviewRoutes } from "./Routes/reviews.routes.js"
import { chat as chatRoutes } from "./Routes/Chat.routes.js"
// chat import 
import {
    handleCreateChat, handleSendMessage, handleEditMessage, handleDeleteMessage, handleMarkMessagesSeen,
    handleDeleteChat, handleTyping, handleUserOnline, handleUserOffline,
} from "./Controller/chat_controller.js"

dotenv.config({ path: ".env" })
connectToDb()

const app = express()
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Get allowed origins from environment variables.
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(o => o.trim()).filter(Boolean)
    : [];

app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ limit: "100mb", extended: true }))

// Enhanced CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin);
        if (isAllowed || allowedOrigins.length === 0) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Enhanced session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: "sessions",
        ttl: 10 * 60,
    }),
    cookie: {
        maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
}));


// API routes
app.get("/", (req, res) => res.send("Hello World"))
app.use("/user", userRoutes)
app.use("/jobs", jobRoutes)
app.use("/review", reviewRoutes)
app.use("/chat", chatRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err)
    res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    })
})

const server = createServer(app)

// Enhanced Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: (origin, cb) => {
            if (!origin) return cb(null, true);
            const isAllowed = allowedOrigins.includes(origin);
            if (isAllowed || allowedOrigins.length === 0) {
                return cb(null, true);
            } else {
                return cb(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
    allowEIO3: true,
})

// Socket.IO authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        console.error("Socket authentication failed: Token missing.")
        return next(new Error("Authentication token missing"))
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Socket authentication failed: Invalid token.", err.message)
            return next(new Error("Invalid token"))
        }
        socket.user = decoded
        console.log("Socket authenticated successfully for user:", decoded?.id)
        next()
    })
})

// Track online users
const onlineUsers = new Map()

// Socket.IO connection handling
io.on("connection", (socket) => {
    const userId = socket.user.id
    console.log(`User connected to Socket.IO with ID: ${socket.id}`)

    // Add user to online users
    onlineUsers.set(userId, socket.id)
    socket.join(userId)

    // Handle user online status
    handleUserOnline(socket, {}, io)

    // Socket event handlers
    socket.on("createChat", (data) => handleCreateChat(socket, data, io))
    socket.on("sendMessage", (data) => handleSendMessage(socket, data, io))
    socket.on("editMessage", (data) => handleEditMessage(socket, data, io))
    socket.on("deleteMessage", (data) => handleDeleteMessage(socket, data, io))
    socket.on("markSeen", (data) => handleMarkMessagesSeen(socket, data, io))
    socket.on("deleteChat", (data) => handleDeleteChat(socket, data, io))
    socket.on("typing", (data) => handleTyping(socket, data, io))

    // Handle disconnect
    socket.on("disconnect", (reason) => {
        console.log(`User disconnected from Socket.IO. Reason: ${reason}`)
        onlineUsers.delete(userId)
        socket.leave(userId.toString())
        handleUserOffline(socket, io)
    })

    // Handle socket errors
    socket.on("error", (err) => {
        console.error(`Socket error for user ${userId}:`, err)
        socket.emit("errorMessage", { statusCode: 500, message: "A socket error occurred." })
    })

    // Handle connection errors
    socket.on("connect_error", (err) => {
        console.error(`Connection error for user ${userId}:`, err)
    })
})

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully")
    server.close(() => {
        console.log("Process terminated")
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`App server and socket server running on this port ${process.env.BASE_URL || `http://localhost:${PORT}`}`)
})