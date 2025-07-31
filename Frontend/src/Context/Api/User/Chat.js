import { chat } from "../Api's.js"

const getToken = () => localStorage.getItem("user_token")

export const getAllChats = async () => {
    try {
        const res = await fetch(chat.getAllChats, {
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken(),
            },
            credentials: "include",
        })
        
        if (!res.ok) {
            const errorDetails = await res.json();
            return { message: errorDetails };
        }

        const data = await res.json()
        return data
    } catch (error) {
        return error.message
    }
}

export const getChatMessages = async (chatId) => {
    try {
        const res = await fetch(`${chat.getChatMessages}/${chatId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken(),
            },
            credentials: "include",
        })

        if (!res.ok) {
            const errorDetails = await res.json();
            return { message: errorDetails };
        }

        const data = await res.json()
        return data
    } catch (error) {
        return error.message
    }
}

export const uploadChatMedia = async (file) => {
    try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("http://localhost:7855/chat/upload-media", {
            method: "POST",
            headers: {
                Authorization: getToken(),
            },
            body: formData,
            credentials: "include",
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to upload file")
        return data
    } catch (error) {
        console.error("uploadChatMedia error:", error)
        throw error
    }
}
