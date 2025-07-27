import mongoose from "mongoose";

// appliedJobs
const appliedJobs = {
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    isSaved: {
        type: Boolean
    },
    isApplied: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now()
    }
}

// review schema
const reviewSchema = {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: String,
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}

// social link schema
const socialLinksSchema = {
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String,
    github: String,
}

// company info schema
const companyInfoSchema = {
    companyName: {
        type: String,
        minlength: 3
    },
    companyType: {
        type: String,
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']
    },
    companyDescription: {
        type: String,
    },
    companyWeb: {
        type: String,
    },
    companyLocation: {
        type: String
    },
    socialLinks: socialLinksSchema,
    companyReviews : [reviewSchema]
}

// job seeker info schema
const jobSeekerInfoSchema = {
    fullName: {
        type: String,
    },
    skills: [{ type: String }],
    eduaction: {
        Institute: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Date,
        endYear: Date,
    },
    experience: {
        jobTitle: String,
        companyName: String,
        employmentType: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
    },
    bio: {
        type: String,
    },
    resumeUrl: {
        type: Object,
        resume_Url: String,
        file_name: String,
        resume_publicId: String,
        size: String,
    },
    socialLinks: socialLinksSchema,
    appliedJobs: [appliedJobs],
    savedJobs: [appliedJobs],
}

const userSchema = new mongoose.Schema(
    {
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
            enum: ["jobseeker", "employer"]
        },
        avatar: {
            type: Object,
            avatar_Url: String,
            public_Id: String,
        },
        companyInfo: {
            type: companyInfoSchema,
            default: undefined,
        },
        jobSeekerInfo: {
            type: jobSeekerInfoSchema,
            default: undefined,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model('user', userSchema);
