import { createContext, useState,useEffect } from "react";
// user auth
import { register, ResendCode, verify_register, Login, LogOut, getUser,updateAvatar } from "./Api/User/userAuth";

export const Context = createContext();

export const ContextApi = ({ children }) => {
    const [userData, setUserData] = useState();
    const [isEmployer, setIsEmployer] = useState(false);
    //fetch user
    const fetchUser = async () => {
        try {
            const data = await getUser();
            setUserData(data.data);

            if (data.data?.role === "employer") {
                setIsEmployer(true);
            }
        } catch (error) {
            console.log("Failed to fetch user:", error.message);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    const userAuth = { register, ResendCode, verify_register, Login, LogOut, getUser,updateAvatar }
    return (
        <Context.Provider value={{ userAuth, userData,setUserData,isEmployer }}>
            {children}
        </Context.Provider>
    )
}