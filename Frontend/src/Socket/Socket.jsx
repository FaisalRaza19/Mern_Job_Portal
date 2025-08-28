import { io } from "socket.io-client"
const apiUrl = import.meta.env.VITE_API_URL
const socket = io(apiUrl, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
  pingTimeout: 60000,
  pingInterval: 25000,
})

export default socket
