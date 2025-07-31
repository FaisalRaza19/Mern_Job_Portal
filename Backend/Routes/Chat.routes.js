// backend/Routes/Chat.routes.js
import { Router } from "express";
import { upload } from "../Middleware/Multer.js";
import { verify_token } from "../Middleware/auth_middleware.js";
import { getAllChats,getChatMessages} from "../Controller/chat_controller.js";

export const chat = Router();
chat.route("/getAllChats").get(upload.none(), verify_token, getAllChats);
chat.route("/getChatMessages/:chatId").get(upload.none(),verify_token,getChatMessages)
