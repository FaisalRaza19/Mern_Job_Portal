import { Router } from "express";
import { upload } from "../Middleware/Multer.js";
import { verify_token } from "../Middleware/auth_middleware.js";
import { postJob,editJob,deleteJob,getJob,getAllJobs} from "../Controller/job_controller.js";

export const route = Router()

route.route("/postJob").post(upload.none(),verify_token,postJob)
route.route("/editJob").post(upload.none(),verify_token,editJob)
route.route("/delJob").delete(upload.none(),verify_token,deleteJob)
route.route("/getJob/jobId=:jobId").get(upload.none(),getJob)
route.route("/getAllJob").get(upload.none(),verify_token,getAllJobs)