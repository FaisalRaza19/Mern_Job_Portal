import { Router } from "express";
import { upload } from "../Middleware/Multer.js";
import { verify_token } from "../Middleware/auth_middleware.js";
import { addReview,editReview,delReview,getAllReviews} from "../Controller/review_controller.js";
export const review = Router();

review.route("/addReview/:companyId").post(upload.none(),verify_token,addReview)
review.route("/editReview/:companyId").post(upload.none(),verify_token,editReview)
review.route("/delReview/:companyId").delete(upload.none(),verify_token,delReview)
review.route("/getReview/:companyId").get(upload.none(),getAllReviews)