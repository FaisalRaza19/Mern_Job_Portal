import { User } from "../Models/user_model.js";
import { validateUserInput } from "../utility/userInput_verifier.js";
import { generate_accessToken, generate_refreshToken, generate_passToken } from "../utility/generateToken.js";
import { sendEmail, verifyEmail, pas_Email } from "../utility/emailVerification.js";
import { fileUploadOnCloudinary, removeFileFromCloudinary } from "../utility/fileUpload_remove.js"
import jwt from "jsonwebtoken"
import { generateUsername } from "../utility/userNameGenerator.js"
import bcrypt from "bcryptjs";


// register user
const valid_register = async (req, res) => {
    try {
        const { fullName, email, password, role, companyName } = req.body;

        // Check basic required fields (excluding fullName for employer)
        if (![email, password, role].every(e => e && e.trim() !== "")) {
            return res.status(400).json({ statusCode: 400, message: "Email, password and role are required" });
        }

        // fullName is required for non-employer roles
        if (role !== "employer" && (!fullName || fullName.trim() === "")) {
            return res.status(400).json({ statusCode: 400, message: "Full name is required" });
        }

        // companyName is required if role is employer
        if (role === "employer" && (!companyName || companyName.trim() === "")) {
            return res.status(400).json({ statusCode: 400, message: "Company name is required for employers" });
        }

        // Validate inputs (only pass fullName if it's required)
        const inputVerify = validateUserInput(
            role === "employer" ? undefined : fullName,
            email,
            password,
            undefined
        );

        if (!inputVerify.isValid) {
            return res.status(400).json({ statusCode: 400, message: inputVerify.errors });
        }

        // Check if user already exists
        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ statusCode: 400, message: "User already exists" });
        }

        // Send email verification code
        const verificationCode = await sendEmail(email);
        if (!verificationCode) {
            return res.status(500).json({ statusCode: 500, message: "Something went wrong while sending the email" });
        }

        // Save info in session
        req.session.userInfo = {
            email,
            password,
            role,
            ...(role !== "employer" && { fullName }),
            ...(role === "employer" && { companyName }),
        };
        req.session.emailCode = verificationCode;

        return res.status(200).json({statusCode: 200,message: "Verification code sent to your email. Please verify it.",});
    } catch (error) {
        return res.status(500).json({statusCode: 500,message: "Internal server error",error: error.message,});
    }
};


// Resend verification code
const resendVerificationCode = async (req, res) => {
    try {
        const { userInfo } = req.session;
        if (!userInfo || !userInfo.email) {
            return res.status(400).json({ statusCode: 400, message: "Session expired or user not found." });
        }

        // resend email  
        const verificationCode = await sendEmail(userInfo.email);
        console.log(verificationCode)
        req.session.emailCode = verificationCode;

        return res.status(200).json({ statusCode: 200, message: "New verification code sent to your email." });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Error while resending verification code.", error: error.message });
    }
};

// verify and register user
const register_user = async (req, res) => {
    try {
        // get info
        const { code } = req.body;
        const { emailCode, userInfo } = req.session;
        const { fullName, email, password, role, companyName } = userInfo

        // verify email
        const verifyMail = verifyEmail(code, emailCode);
        if (!verifyMail) {
            return res.status(401).json({ statusCode: 400, message: "Invalid email code" })
        }
        // assign userName 
        let userName;
        while (true) {
            const sampleUserName = generateUsername(fullName || companyName);
            // find the user
            const findUserName = await User.findOne({ userName: sampleUserName })
            if (!findUserName) {
                userName = sampleUserName
                break;
            }
        };

        // hashed the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create the new user user
        let user;
        if (role == "employer") {
            user = new User({
                companyInfo: {
                    companyName: companyName
                },
                email,
                password: hashedPassword,
                userName,
                role,
            })
        } else {
            user = new User({
                fullName,
                email,
                password: hashedPassword,
                userName,
                role,
            });
        }


        await user.save();


        // generate tokens
        const accessToken = generate_accessToken(user._id);
        const refreshToken = generate_refreshToken(user._id);

        // update db and add refreshtoken 
        user.refreshToken = refreshToken
        await user.save();

        // create user object
        const createdUser = await User.findById(user._id).select("-password -refreshtoken");
        if (!createdUser) {
            return res.status(500).json({ statusCode: 500, message: "Internal server error" });
        }

        req.session.userInfo = null;
        req.session.emailCode = null;

        return res.status(200).json({ statusCode: 200, message: "User create successfully", data: createdUser, accesstoken: accessToken });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal server error", error: error.message })
    }
}

// login user 
const login = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        if (!((email || userName) && password && password.trim() !== "")) {
            return res.status(400).json({ statusCode: 400, message: "Email or Username and Password are required" });
        }


        // check user input is valid
        const inputVerify = validateUserInput(undefined, email || undefined, password, userName || undefined);
        if (!inputVerify.isValid) {
            return res.status(400).json({ statusCode: 400, message: inputVerify.errors })
        }

        // find the user in db
        const user = await User.findOne({ $or: [{ email }, { userName }], });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User did have not exist" })
        }

        // compare the pass 
        const matchPass = await bcrypt.compare(password, user.password)
        if (!matchPass) {
            return res.status(400).json({ statusCode: 400, message: "Incorrect Password" })
        }

        // generate tokens
        const accessToken = generate_accessToken(user._id);
        const refreshToken = generate_refreshToken(user._id);

        // update db and add refreshtoken 
        user.refreshToken = refreshToken;
        await user.save();

        // create user object
        const logIn_User = await User.findById(user._id).select("-password -refreshtoken");
        if (!logIn_User) {
            return res.status(500).json({ statusCode: 500, message: "Internal server error" });
        }

        return res.status(200).json({ statusCode: 200, message: "User Login successfully", data: logIn_User, accesstoken: accessToken });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal server error", error: error.message })
    }
}

// logout user
const logOut = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ statusCode: 400, message: "User is unauthroized" })
        };

        // delete refreshToken from database 
        await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } })

        // clear cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")

        return res.status(200).json({ statusCode: 200, status: 200, message: "User logOut Successfully" })

    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Error during LogOut the user.", error: error.message });
    }
}

// change avatar
const changeAvatar = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };

        // Check if shopLogo file is provided
        if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
            return res.status(400).json({ statusCode: 400, message: "Avatar file is required" });
        }

        const avatarPath = req.files.avatar[0].path

        // check if the user exists
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User does not exist" });
        }

        // If user has an existing avatar, clear it
        if (user.avatar?.public_Id) {
            await removeFileFromCloudinary(user.avatar.public_Id);
        }

        // upload avatar to Cloudinary
        const folder = "Job Portal/User Avatar"
        const fileUpload = await fileUploadOnCloudinary(avatarPath, folder);

        // update in db
        user.avatar = {
            avatar_Url: fileUpload.url,
            public_Id: fileUpload.public_id,
        }
        await user.save();

        return res.status(200).json({ statusCode: 200, data: fileUpload.url, message: "Avatar updated successfully" });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while updating the avatar", error: error.message });
    }
}

// login is required
const editProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ statusCode: 400, message: "Unauthorized user" });
        }

        const { email, fullName, userName } = req.body;
        if (!email || !fullName || !userName) {
            return res.status(400).json({ statusCode: 400, message: "All fields required" })
        }

        // validate input 
        const inputVerify = validateUserInput(fullName, email, undefined, userName);
        if (!inputVerify.isValid) {
            return res.status(400).json({ statusCode: 400, message: inputVerify.errors })
        }

        // Check if email or username is already in use by another user, excluding the current user
        const checkUser = await User.findOne({
            $or: [{ userName }, { email }],
            _id: { $ne: userId }
        });

        if (checkUser) {
            return res.status(400).json({ statusCode: 400, message: "Username or email is already taken. Please try another." });
        }

        // find the current user through id
        const currentUser = await User.findById(userId).select("-password -refreshToken");
        if (!currentUser) {
            return res.status(404).json({ statusCode: 400, message: "User not found" });
        }

        // Check if email has changed then send the code into email
        if (currentUser.email !== email) {
            // send code to emial 
            const verificationCode = await sendEmail(email);
            console.log(verificationCode)
            if (!verificationCode) {
                return res.status(500).json({ statusCode: 500, message: "Failed to send verification code" });
            }
            req.session.emailCode = verificationCode;
            req.session.userInfo = req.body;
            return res.status(200).json({ statusCode: 200, message: "Verification code sent to your email. Please verify." });
        }

        // if email is not changed then simply update in db
        currentUser.fullName = fullName;
        currentUser.userName = userName;
        await currentUser.save();

        return res.status(200).json({ statusCode: 200, message: "Profile updated successfully", data: currentUser });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "An error occurred while updating the profile.", error: error.message });
    }
};

// update profile in db
const updateProfile = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: "Verification code is required." });
        }

        // get user id from token
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ statusCode: 400, message: "Unauthorized user" });
        }

        // find the user in db
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ statusCode: 400, message: "User does not exist" });
        }

        // get data from session
        const { emailCode, userInfo } = req.session;
        const isVerified = verifyEmail(code, emailCode);
        if (!userInfo || !isVerified) {
            return res.status(400).json({ statusCode: 400, message: "User data not found in session or verification incomplete. Please complete the edit profile process again." });
        }

        const { fullName, email, userName } = userInfo;

        // Update the user profile
        user.fullName = fullName;
        user.email = email;
        user.userName = userName;
        await user.save();

        // Clear session data after update
        req.session.emailCode = null;
        req.session.userInfo = null;

        return res.status(200).json({ statusCode: 200, message: "Profile updated successfully", data: user });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "An error occurred while updating the profile.", error: error.message });
    }
};

// get user
const getUser = async (req, res) => {
    try {
        // get id from token
        const userId = req.user._id;

        // find the user in db
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User did not exist" })
        };

        return res.status(200).json({ statusCode: 200, data: user, message: "User get Successfully" })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to get the User", error: error.message });
    }
}

// change password
const email_for_Pass = async (req, res) => {
    try {
        // get id from token
        const userId = req.user?._id;

        // find the user in db
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User did not exist" })
        };

        const token = generate_passToken(userId);
        req.session.passToken = { token, used: false }

        // send the email for pass change
        const sendEmail = await pas_Email(user.email, token);
        if (!sendEmail) {
            return res.status(500).json({ statusCode: 500, message: "Something went wrong to send the email" })
        }

        return res.status(200).json({ statusCode: 200, message: "Check your email box." })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to get the User", error: error.message });
    }
}

// update password in db
const update_pass = async (req, res) => {
    try {
        // get id from token
        const { token } = req.params;
        const { new_pass } = req.body;

        // check token
        const sessionToken = req.session.passToken;
        if (!sessionToken || sessionToken.token !== token || sessionToken.used) {
            return res.status(401).json({ statusCode: 400, message: "Token is invalid or already used" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // validate pass
        const checkPass = validateUserInput(null, null, new_pass, null)
        if (!checkPass) {
            return res.status(400).json({ statusCode: 400, message: checkPass.errors })
        }

        // create password hash
        const hashedPassword = await bcrypt.hash(new_pass, 10);

        // find the user and change the pass in db
        const changePass = await User.findByIdAndUpdate(decoded?.id, { $set: { password: hashedPassword } })
        if (!changePass) {
            return res.status(500).json({ statusCode: 500, message: "something went wrong to change the pass" })
        };

        req.session.passToken = null

        return res.status(200).json({ statusCode: 200, message: "Your password change successfully" });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to get the User", error: error.message });
    }
}

export {
    valid_register, resendVerificationCode, register_user, login, logOut, changeAvatar, editProfile,
    updateProfile, email_for_Pass, update_pass, getUser
}
