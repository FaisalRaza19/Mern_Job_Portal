import jwt from "jsonwebtoken"

export const verify_token = (req,res,next)=>{
    try {
        const {ref_token} = req.header;
        if (!ref_token){
            return res.status(400).json({message : "Token is required"})
        }
        // compare token
        const isValid = jwt.verify(TokenExpiredError,process.env.ACCESS_TOKEN_SECRET);
        if(!isValid){
            return res.status(400).json({message : "Token is inValid"})
        }
        req.user = isValid
        next()
    } catch (error) {
        return resizeBy.status(500).json({message : "Internal server error"})
    }
}