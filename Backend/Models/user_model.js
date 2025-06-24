import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'jobseeker',
            enum : ["jobseeker","employer"]
        },
        avatar: {
            type: Object,
            avatar_Url: String,
            public_Id: String,
        },
        refreshToken: {
            type: String,
        },

        // company info
        companyInfo : {
            companyName : {
                type : String,
            },
            companyDescription : {
                type : String,
            },
            companyAvatar : {
                type : Object,
                avatar_Url: String,
                public_Id: String,
            },
            companyWeb : {
                type : String,
            }
        }
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model('user', userSchema);
