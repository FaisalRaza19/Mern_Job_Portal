import { Router } from "express";
import { upload } from "../Middleware/Multer.js";
import { verify_token } from "../Middleware/auth_middleware.js";
import { postJob, editJob, deleteJob, getJob, getAllJobs, allJob } from "../Controller/job_controller.js";
import { applyJob, saveJob, getSavedAndAppliedJobs, changeApplicationStatus } from "../Controller/apply_manage_job_controller.js"

export const route = Router()

route.route("/postJob").post(upload.none(), verify_token, postJob)
route.route("/editJob").post(upload.none(), verify_token, editJob)
route.route("/delJob").delete(upload.none(), verify_token, deleteJob)
route.route("/getJob/jobId=:jobId").get(upload.none(), getJob)
route.route("/getAllJob").get(upload.none(), verify_token, getAllJobs)
route.route("/allJob").get(upload.none(), allJob)

// apply job
route.route("/applyJob").post(upload.fields([{ name: "resume", maxCount: 1 }]), verify_token, applyJob)
route.route("/saveJob").post(upload.none(), verify_token, saveJob)
route.route("/get-Saved-applied-Jobs").get(upload.none(), verify_token, getSavedAndAppliedJobs)
route.route("/change-status").post(upload.none(), verify_token, changeApplicationStatus)