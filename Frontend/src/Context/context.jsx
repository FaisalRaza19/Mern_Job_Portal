import { createContext } from "react";
// user auth
// import { register,ResendCode,verify_register,Login,LogOut,} from "./Api/User/userAuth";

export const Context = createContext();

export const ContextApi = ({ children }) => {
    const name = 'Faisal Raza'
    return (
        <Context.Provider value={name}>
            {children}
        </Context.Provider>
    )
}