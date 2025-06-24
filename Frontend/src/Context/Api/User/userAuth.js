import {userAuth} from "../Api's.js"

export const register = async({formData,navigate})=>{
    try {
        const response = await fetch(userAuth.register,{
            method : "POST",
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify(formData),
            credentials : "include"
        });

        if(!response.ok){
            const errorDetails = await response.json();
            return { message: errorDetails.message.message || errorDetails.message };
        }
        const data = await response.json();
        console.log("register",data)
        navigate("/")
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
            body: JSON.stringify({code}),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails.message };
        }

        const data = await response.json();
         consle.log(data)
         localStorage.setItem("user_token", data.data.accessToken);
         navigate("/user-dashboard");
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
        consle.log(data)
        return data;
    } catch (error) {
        return error.message
    }
};

// login user
export const Login = async ({formData, navigate, setIsLogedIn }) => {
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
        consle.log(data)
        localStorage.setItem("user_token", data.data.accessToken)
        setIsLogedIn(true);
        navigate("/user-dashboard");
        FetchUser();
        return data;
    } catch (error) {
        return error.message;
    }
};

export const LogOut = async ({ navigate, setIsLogedIn }) => {
    try {
        const token = localStorage.getItem("user_token");

        const response = await fetch(api.LogOut, {
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
        setIsLogedIn(false);
        localStorage.removeItem("user_token");
        navigate("/login")
        return data;
    } catch (error) {
        return error.message;
    }
};