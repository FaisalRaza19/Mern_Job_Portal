import { User } from "../Models/user_model.js";
import { validateUserInput, validateCompanyData, socialLinkVerify } from "../utility/userInput_verifier.js";
import { generate_accessToken, generate_refreshToken, generate_passToken } from "../utility/generateToken.js";
import { sendEmail, verifyEmail, pas_Email } from "../utility/emailVerification.js";
import { fileUploadOnCloudinary, removeFileFromCloudinary } from "../utility/fileUpload_remove.js"
import { fileSizeFormatter } from "../utility/fileSizeFormater.js"
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

        return res.status(200).json({ statusCode: 200, message: "Verification code sent to your email. Please verify it.", });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal server error", error: error.message, });
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
                jobSeekerInfo: {
                    fullName,
                },
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
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
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
        const logIn_User = await User.findById(user._id).select("-password -refreshToken");
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

        return res.status(200).json({ statusCode: 200, message: "User logOut Successfully" })

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
            const resourceType = "image"
            await removeFileFromCloudinary(user.avatar.public_Id,resourceType);
        }

        // upload avatar to Cloudinary
        const folder = "Job Portal/User Avatar"
        const resourceType = "image"
        const fileUpload = await fileUploadOnCloudinary(avatarPath, folder,resourceType);

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
        // get user id from token
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ statusCode: 401, message: "Unauthorized user" });
        }

        // find the user in db
        const currentUser = await User.findById(userId).select("-password -refreshToken");
        if (!currentUser) {
            return res.status(404).json({ statusCode: 404, message: "User not found" });
        }
        const { email, fullName, bio, userName, companyName, companyType, companySize, companyWeb, companyDescription, socialLinks = {},companyLocation} = req.body;

        const { linkedin = "", facebook = "", twitter = "", instagram = "", github = "" } = socialLinks;

        if (!email || !userName) {
            return res.status(400).json({ statusCode: 400, message: "Email and Username are required" });
        }

        // social link obj
        let socialLinksObj = { linkedin, facebook, twitter, instagram, github };

        // Validate basic user input
        const inputVerify = validateUserInput(fullName, email, undefined, userName);
        if (!inputVerify.isValid == true) {
            return res.status(400).json({ statusCode: 400, message: inputVerify.errors });
        }

        // Validate employer-specific info
        if (currentUser.role === "employer") {
            if (!companyName) {
                return res.status(400).json({ statusCode: 400, message: "Company name is required" });
            }
            const optionalFields = {
                companyType,
                companySize,
                companyWeb,
                companyDescription,
                socialLinks: { linkedin, facebook, twitter, instagram, github },
                companyLocation,
            };

            // Only validate if optional fields are provided
            const providedFields = {};
            for (const [key, value] of Object.entries(optionalFields)) {
                if (value || typeof value === "object") {
                    providedFields[key] = value;
                }
            }
            const companyValidation = validateCompanyData({ companyName, ...providedFields });
            if (!companyValidation.isValid) {
                return res.status(400).json({
                    statusCode: 400,
                    message: companyValidation.errors,
                    errors: companyValidation.errors
                });
            }
        } else {
            if(!fullName){
                return res.status(400).json({ statusCode: 400, message: "fullName is required" });
            }
            if (typeof bio === 'string' && bio.trim().length > 0 && bio.trim().length < 50) {
                return res.status(400).json({ statusCode: 400, message: "Bio must be at least 50 characters." });
            }
            const verifySocialLink = socialLinkVerify(socialLinksObj);
            if (!verifySocialLink.isValid) {
                return res.status(400).json({ statusCode: 400, message: "Invalid social Links", errors: verifySocialLink.errors });
            }
        }

        // Check for duplicate username/email
        const checkUser = await User.findOne({
            $or: [{ userName }, { email }],
            _id: { $ne: userId }
        });

        if (checkUser) {
            return res.status(400).json({ statusCode: 400, message: "Username or email is already taken. Please try another." });
        }

        // If email changed, send verification code
        if (email !== currentUser.email) {
            const verificationCode = await sendEmail(email);
            if (!verificationCode) {
                return res.status(500).json({ statusCode: 500, message: "Failed to send verification code" });
            }

            req.session.emailCode = verificationCode;
            req.session.userInfo = req.body;
            req.session.role = currentUser.role;

            return res.status(201).json({
                statusCode: 201,
                message: "Verification code sent to your email. Please verify."
            });
        }

        // Perform update
        currentUser.userName = userName;

        if (currentUser.role === "employer") {
            currentUser.companyInfo.companyName = companyName;
            if (companyType) currentUser.companyInfo.companyType = companyType;
            if (companySize) currentUser.companyInfo.companySize = companySize;
            if (companyWeb) currentUser.companyInfo.companyWeb = companyWeb;
            if (companyDescription) currentUser.companyInfo.companyDescription = companyDescription;
            if (companyLocation) currentUser.companyInfo.companyLocation = companyLocation;
            currentUser.companyInfo.socialLinks = { linkedin, facebook, twitter, instagram, github };
        } else {
            currentUser.jobSeekerInfo.fullName = fullName;
            if (bio) currentUser.jobSeekerInfo.bio = bio;
            currentUser.jobSeekerInfo.socialLinks = { linkedin, facebook, twitter, instagram, github };
        }

        await currentUser.save();

        return res.status(200).json({ statusCode: 200, message: "Profile updated successfully", data: currentUser });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "An error occurred while edit updating the profile.", error: error });
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
            return res.status(400).json({ statusCode: 400, message: "Unauthorized user" });
        }

        // find the user in db
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User does not exist" });
        }

        // get data from session
        const { emailCode, userInfo, role } = req.session;
        const isVerified = verifyEmail(code, emailCode);
        if (!userInfo || !isVerified) {
            return res.status(400).json({ statusCode: 400, message: "User data not found in session or verification incomplete. Please complete the edit profile process again." });
        }

        const { fullName, bio, email, userName, companyName, companyType, companySize, companyWeb, companyDescription, socialLinks, companyLocation } = userInfo;
        // Update the user profile
        if (role === "employer") {
            user.companyInfo.companyName = companyName
            user.companyInfo.companyType = companyType;
            user.companyInfo.companySize = companySize;
            user.companyInfo.companyWeb = companyWeb;
            user.companyInfo.companyDescription = companyDescription;
            user.companyInfo.socialLinks = socialLinks;
            user.companyInfo.companyLocation = companyLocation;
        } else {
            user.jobSeekerInfo.fullName = fullName;
            user.jobSeekerInfo.bio = bio;
            user.jobSeekerInfo.socialLinks = socialLinks;
        }
        user.email = email;
        user.userName = userName;
        await user.save();

        // Clear session data after update
        req.session.emailCode = null;
        req.session.userInfo = null;
        req.session.role = null;

        return res.status(200).json({ statusCode: 200, message: "Profile updated successfully", data: user });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "An error occurred while verify and updating the profile.", error: error.message });
    }
};

// update edu and exp
const updateJobseekerInfo = async (req, res) => {
    try {
        // get user id from token
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "Unauthorized user" });
        }

        // find the user in db
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User does not exist" });
        }

        const { jobTitle, companyName, employmentType, location, startDate, endDate, current, description, degree, Institute, fieldOfStudy, startYear, endYear } = req.body

        // Validation
        if (startDate && !current && endDate && new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ statusCode: 400, message: "End date must be after start date." });
        }

        if (startYear && endYear && endYear < startYear) {
            return res.status(400).json({ statusCode: 400, message: "End year must be greater than or equal to start year." });
        }

        if (description && description.trim().length < 50) {
            return res.status(400).json({ statusCode: 400, message: "Description must be at least 50 characters long." });
        }

        // edu update in db 
        if (degree) user.jobSeekerInfo.eduaction.degree = degree
        if (Institute) user.jobSeekerInfo.eduaction.Institute = Institute
        if (fieldOfStudy) user.jobSeekerInfo.eduaction.fieldOfStudy = fieldOfStudy
        if (startYear) user.jobSeekerInfo.eduaction.startYear = startYear
        if (endYear) user.jobSeekerInfo.eduaction.endYear = endYear
        // exp update in db 
        if (jobTitle) user.jobSeekerInfo.experience.jobTitle = jobTitle
        if (companyName) user.jobSeekerInfo.experience.companyName = companyName
        if (employmentType) user.jobSeekerInfo.experience.employmentType = employmentType
        if (location) user.jobSeekerInfo.experience.location = location
        if (startDate) user.jobSeekerInfo.experience.startDate = startDate
        if (current === true || current === "true") {
            user.jobSeekerInfo.experience.endDate = null
            user.jobSeekerInfo.experience.current = true
        } else {
            if (endDate) user.jobSeekerInfo.experience.endDate = endDate
            user.jobSeekerInfo.experience.current = false
        }
        if (description) user.jobSeekerInfo.experience.description = description

        await user.save()

        return res.status(200).json({ statusCode: 200, message: "Profile update successfully", data: user.jobSeekerInfo })

    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "An error occurred while updating the edu and exp.", error: error.message });
    }
}

// update skills and resume
const update_Skills_Resume = async (req, res) => {
    try {
        // Get user ID from token
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "Unauthorized user" });
        }

        // Find user in DB
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: "User does not exist" });
        }

        // Get resume file path and skills
        const resume = req?.files?.resume?.[0]?.path;
        let { skills } = req.body;

        // Delete existing resume from Cloudinary if needed
        if (resume && user.jobSeekerInfo.resumeUrl?.resume_publicId) {
            const resourceType = "raw"
            await removeFileFromCloudinary(user.jobSeekerInfo.resumeUrl.resume_publicId, resourceType);
        }

        // Upload new resume to Cloudinary
        let fileUpload = null;
        if (resume) {
            const folder = "Job Portal/User Resume";
            const resourceType = "raw"
            fileUpload = await fileUploadOnCloudinary(resume, folder, resourceType);
        }

        // Save resume URL if uploaded
        if (fileUpload?.url) {
            user.jobSeekerInfo.resumeUrl = {
                resume_Url: fileUpload.url,
                file_name: fileUpload.original_filename,
                resume_publicId: fileUpload.public_id,
                size: fileSizeFormatter(fileUpload.bytes, 2)
            };
        }

        // Parse and validate skills
        if (skills) {
            try {
                if (typeof skills === 'string') {
                    skills = JSON.parse(skills);
                }

                // Ensure skills is an array of strings
                if (Array.isArray(skills)) {
                    user.jobSeekerInfo.skills = skills.map(skill => String(skill));
                } else {
                    return res.status(400).json({ message: "Skills must be a valid array of strings." });
                }
            } catch (err) {
                return res.status(400).json({ message: "Invalid Skills format. Must be a valid JSON array." });
            }
        }

        await user.save();

        return res.status(200).json({
            statusCode: 200, message: "Profile updated successfully",
            data: { Skills: user.jobSeekerInfo.skills, resumeUrl: user.jobSeekerInfo.resumeUrl?.resume_Url }
        });

    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "An error occurred while updating the skills and resume.", error: error.message });
    }
};

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

// verify jwt
const userVerifyJWT = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };
        return res.status(200).json({ statusCode: 200, message: "token is valid", data: true })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to verify and edit the shop", error: error })
    }
}

export {
    valid_register, resendVerificationCode, register_user, login, logOut, changeAvatar, editProfile,
    updateProfile, email_for_Pass, update_pass, getUser, userVerifyJWT, updateJobseekerInfo,
    update_Skills_Resume
}
