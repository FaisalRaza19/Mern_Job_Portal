import jwt from "jsonwebtoken";

export const generate_accessToken = (payload)=>{
    const accessToken = jwt.sign({id : payload},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
    console.log(accessToken);
    return accessToken
}

export const generate_refreshToken = (payload)=>{
    const refreshToken = jwt.sign({id : payload},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_SECRET});
    console.log("Ref",refreshToken);
    return refreshToken
}