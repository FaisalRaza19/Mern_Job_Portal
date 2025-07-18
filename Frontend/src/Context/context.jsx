import { createContext, useState, useEffect } from "react";
// user auth
import {
    register, ResendCode, verify_register, Login, LogOut, getUser, updateAvatar, verifyJWT,
    editProfile, verifyAndUpdateProfile, update_Edu_Exp, update_skills_resume,
} from "./Api/User/userAuth";

import { postJobs, getAllJobs, editJob, delJob, allJob } from "./Api/User/Jobs.js";

export const Context = createContext();

export const ContextApi = ({ children }) => {
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [image, setImage] = useState("");
    const [userData, setUserData] = useState();
    const [isEmployer, setIsEmployer] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [allJobList, setAllJobList] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([] || "");

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
            setUserData(data.data);
            setIsLoggedIn(true);
            if (data.data?.role === "employer") {
                setIsEmployer(true);
            }
        } catch (error) {
            console.log("Failed to fetch user:", error.message);
        }
    };

    // fetch all jobs and filter by skills
    const fetchAndFilterJobs = async () => {
        try {
            const data = await allJob();
            const jobs = data.data;
            console.log(jobs)
            setAllJobList(jobs);

            // Filter jobs by skills if userData and skills are available
            if (userData?.role === "jobseeker" || userData?.jobSeekerInfo?.skills?.length > 0) {
                const userSkills = userData?.jobSeekerInfo?.skills?.map(skill => skill.toLowerCase());
                console.log(userSkills)
                const matchedJobs = jobs?.filter((e) => {
                    e?.skillsRequired?.some((e) => {
                        userSkills?.includes(e?.toLowerCase())
                    })
                })

                console.log("Matched Jobs:", matchedJobs);
                setFilteredJobs(matchedJobs);
            }

        } catch (error) {
            console.log("Error getting all jobs:", error.message);
        }
    };

    // Sequentially run after fetching user
    useEffect(() => {
        verifyToken();
        if (setIsLoggedIn) {
            fetchUser();
        }
    }, []);

    // Fetch jobs after userData is available
    useEffect(() => {
        if (userData) {
            fetchAndFilterJobs();
        }
    }, [userData]);

    const userProfile = { isEditProfile, setIsEditProfile };
    const verifyUser = { isVerify, isLoggedIn, setIsLoggedIn };
    const userAuth = {
        register, ResendCode, verify_register, Login, LogOut, getUser, updateAvatar,
        verifyJWT, editProfile, verifyAndUpdateProfile, update_Edu_Exp, update_skills_resume,
    };
    const Jobs = { postJobs, getAllJobs, editJob, delJob };
    const userImage = { image, setImage };

    return (
        <Context.Provider value={{
            userAuth, userData, setUserData, isEmployer, setIsEmployer, userImage, verifyUser, userProfile, Jobs,
            allJobList, filteredJobs
        }}>
            {children}
        </Context.Provider>
    );
};
