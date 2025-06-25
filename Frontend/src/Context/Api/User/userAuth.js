import { userAuth } from "../Api's.js"

export const register = async (formData, navigate) => {
    try {
        localStorage.setItem("email", formData.email)
        const response = await fetch(userAuth.register, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: "include"
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }
        const data = await response.json();
        navigate("/email-verify")
        return data
    } catch (error) {
        return error.message
    }
}


// Updated CodeVerify Function
export const verify_register = async ({ code, navigate, setIsLogedIn }) => {
    try {
        const response = await fetch(userAuth.verify_register, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }

        const data = await response.json();
        localStorage.setItem("user_token", data.accesstoken);
        if (data.data.role === "jobseeker") {
            navigate("/jobseeker-dashboard");
        } else {
            navigate("/employer-dashboard");
        }
        setIsLogedIn(true);
        return data;
    } catch (error) {
        return error.message;
    }
};

// resend code 
export const ResendCode = async () => {
    try {
        const response = await fetch(userAuth.resendCode, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return errorDetails.message;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error.message
    }
};

// login user
export const Login = async ({ formData, navigate, setIsLoggedIn }) => {
    try {
        const response = await fetch(userAuth.login, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return errorDetails.message;
        }

        const data = await response.json();
        localStorage.setItem("user_token", data.accesstoken)
        setIsLoggedIn(true);
        if (data.data.role === "jobseeker") {
            navigate("/jobseeker-dashboard");
        } else {
            navigate("/employer-dashboard");
        }
        // FetchUser();
        return data;
    } catch (error) {
        return error.message;
    }
};

// LogOut User
export const LogOut = async ({ navigate, setIsLoggedIn }) => {
    try {
        const token = localStorage.getItem("user_token");

        const response = await fetch(userAuth.logOut, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }
        const data = await response.json();
        setIsLoggedIn(false);
        localStorage.removeItem("user_token");
        navigate("/login")
        return data;
    } catch (error) {
        return error.message;
    }
};

// fetch User
export const getUser = async () => {
    try {
        const token = localStorage.getItem("user_token");

        const response = await fetch(userAuth.getUser, {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
};


// update avatar
export const updateAvatar = async (file) => {
    if (!file) {
        return { message: "Please select a file to upload." };
    }
    try {
        const token = localStorage.getItem("user_token");
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await fetch(userAuth.updateAvatar, {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return error.message;
    }
};

