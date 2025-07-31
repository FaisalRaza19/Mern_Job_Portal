import { io } from "socket.io-client"

const socket = io("http://localhost:7855", {
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
  pingTimeout: 60000,
  pingInterval: 25000,
})

export default socket
