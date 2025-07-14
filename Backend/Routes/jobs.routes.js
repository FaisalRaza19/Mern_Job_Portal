import { Router } from "express";
import { upload } from "../Middleware/Multer.js";
import { verify_token } from "../Middleware/auth_middleware.js";
import { postJob } from "../Controller/job_controller.js";

export const route = Router()

route.route("/postJob").post(upload.none(),verify_token,postJob)