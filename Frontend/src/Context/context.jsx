import { createContext, useState, useEffect } from "react";
// user auth
import {
    register, ResendCode, verify_register, Login, LogOut, getUser, updateAvatar, verifyJWT,
    editProfile, verifyAndUpdateProfile, update_Edu_Exp, update_skills_resume,
} from "./Api/User/userAuth";

import { postJobs, getAllJobs, editJob, delJob, allJob, getJobFromId } from "./Api/User/Jobs.js";

export const Context = createContext();

export const ContextApi = ({ children }) => {
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [image, setImage] = useState("");
    const [userData, setUserData] = useState();
    const [isEmployer, setIsEmployer] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // verify jwt
    const verifyToken = async () => {
        try {
            const data = await verifyJWT(setIsVerify);
            if (data.message === "Token is invalid or expired") {
                setIsVerify(false);
                setIsLoggedIn(false);
                localStorage.removeItem("user_token");
            } else {
                setIsVerify(true);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.log("Token", error.message);
        }
    };

    // fetch user data
    const fetchUser = async () => {
        try {
            const data = await getUser();
            if (data.statusCode === 200) {
                setUserData(data.data);
                setIsLoggedIn(true);
            }
            if (data.data?.role === "employer") {
                setIsEmployer(true);
            }
        } catch (error) {
            console.log("Failed to fetch user:", error.message);
        }
    };

    // Sequentially run after fetching user
    useEffect(() => {
        verifyToken();
        if (isLoggedIn === true) {
            fetchUser();
        }
    }, [isLoggedIn]);

    const userProfile = { isEditProfile, setIsEditProfile };
    const verifyUser = { isVerify, isLoggedIn, setIsLoggedIn };
    const userAuth = {
        register, ResendCode, verify_register, Login, LogOut, getUser, updateAvatar,
        verifyJWT, editProfile, verifyAndUpdateProfile, update_Edu_Exp, update_skills_resume,
    };
    const Jobs = { postJobs, getAllJobs, editJob, delJob, allJob, getJobFromId };
    const userImage = { image, setImage };

    return (
        <Context.Provider value={{
            userAuth, userData, setUserData, isEmployer, setIsEmployer, userImage, verifyUser, userProfile, Jobs,
        }}>
            {children}
        </Context.Provider>
    );
};
