import { Router } from "express";
import {
    valid_register, resendVerificationCode, register_user, login, logOut, changeAvatar, editProfile,
    updateProfile, email_for_Pass, update_pass, getUser
} from "../Controller/userAuth_controller.js";

import { upload } from "../Middleware/Multer.js";
import { verify_token } from "../Middleware/auth_middleware.js";

export const router = Router();

router.route("/register").post(upload.none(), valid_register);
router.route("/resend-code").post(upload.none(), resendVerificationCode);
router.route("/verify-register").post(upload.none(), register_user);
router.route("/login").post(upload.none(), login);
router.route("/logOut").post(upload.none(), verify_token, logOut);
router.route("/change-avatar").post(upload.fields([{ name: "avatar", maxCount: 1 }]), verify_token, changeAvatar);
router.route("/edit-profile").post(upload.none(),verify_token, editProfile);
router.route("/verify-profile").post(upload.none(),verify_token, updateProfile);
router.route("/email-pass").post(upload.none(),verify_token, email_for_Pass);
router.route("/change-pass/:token").post(upload.none(),verify_token,update_pass);
router.route("/get-user").get(upload.none(),verify_token, getUser);

