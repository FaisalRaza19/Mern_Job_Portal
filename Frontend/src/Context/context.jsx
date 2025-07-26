import { createContext, useState, useEffect } from "react";
// user auth
import {
    register, ResendCode, verify_register, Login, LogOut, getUser, updateAvatar, verifyJWT,
    editProfile, verifyAndUpdateProfile, update_Edu_Exp, update_skills_resume,
} from "./Api/User/userAuth";

import {
    postJobs, getAllJobs, editJob, changeStatus, delJob, allJob, getJobFromId,
    applyJob, saveJob, saved_applied_jobs, changeApplicationStatus
} from "./Api/User/Jobs.js";

export const Context = createContext();

export const ContextApi = ({ children }) => {
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [image, setImage] = useState("");
    const [userData, setUserData] = useState();
    const [isEmployer, setIsEmployer] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [alert, setAlert] = useState();

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
            showAlert(data)
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

    useEffect(() => {
        if (userData?.role === "jobseeker" && userData?.jobSeekerInfo?.appliedJobs) {
            const ids = userData.jobSeekerInfo.appliedJobs
                .filter((j) => j.isApplied === true)
                .map((j) => j.jobId);
            setAppliedJobIds(ids);
        }
        if (userData?.role === "jobseeker" && userData?.jobSeekerInfo?.savedJobs) {
            const ids = userData.jobSeekerInfo.savedJobs.map((j) => j.jobId);
            setSavedJobIds(ids);
        }
    }, [userData]);

    const onClose = () => setAlert(null);
    const showAlert = (data) => {
        setAlert(data);
    }

    const userProfile = { isEditProfile, setIsEditProfile };
    const verifyUser = { isVerify, isLoggedIn, setIsLoggedIn };
    const userAuth = {
        register, ResendCode, verify_register, Login, LogOut, getUser, updateAvatar,
        verifyJWT, editProfile, verifyAndUpdateProfile, update_Edu_Exp, update_skills_resume,
    };
    const Jobs = {
        postJobs, getAllJobs, editJob, changeStatus, delJob, allJob, getJobFromId, applyJob, saveJob,
        saved_applied_jobs, changeApplicationStatus
    };
    const userImage = { image, setImage };
    const JobsAction = { savedJobIds, setSavedJobIds, appliedJobIds, setAppliedJobIds }

    return (
        <Context.Provider value={{
            userAuth, userData, setUserData, isEmployer, setIsEmployer, userImage, verifyUser, userProfile, Jobs,
            JobsAction, alert, showAlert, onClose
        }}>
            {children}
        </Context.Provider>
    );
};
