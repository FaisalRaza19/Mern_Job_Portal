import jwt from "jsonwebtoken"
import {User} from "../Models/user_model.js"

export const verify_token = async(req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }
        // compare token
        const isValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!isValid) {
            return res.status(400).json({ message: "Token is inValid" })
        }
        //find the user
        const user = await User.findById(isValid.id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized request, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return resizeBy.status(500).json({ message: "Internal server error" })
    }
}