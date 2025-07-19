import { User } from "../Models/user_model.js"
import { Job } from "../Models/job_model.js"
import { validateJobPostData } from "../utility/job_Input_Verifier.js"

// post job
const postJob = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };

        // find the user 
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user || user.role === "jobseeker") {
            return res.status(400).json({ statusCode: 400, message: "User not found and You are not elligeable to post the job" })
        }

        // get the data from req.body
        const { title, description, location, salary, employmentType, experienceLevel, Requirements, skillsRequired, openings, applicationDeadline, isRemote } = req.body
        const { min_salary, max_salary, currency } = salary || {}

        // validate job data
        const verifyData = validateJobPostData(req.body);
        if (!verifyData.valid) {
            return res.status(400).json({ statusCode: 400, message: verifyData.errors })
        }

        // create the job and push it in db
        const job = await Job.create({
            title,
            Requirements,
            description,
            company: user._id,
            location: isRemote === true ? null : location,
            salary: {
                min_salary,
                max_salary,
                currency,
            },
            employmentType,
            experienceLevel,
            skillsRequired,
            openings,
            applicationDeadline,
            isRemote,
        })

        if (!job) {
            return res.status(500).json({ statusCode: 400, message: "internal server error to create Job" })
        }

        return res.status(200).json({ statusCode: 200, message: "Job create successfully", data: job })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to post a job", error: error.message })
    }
}

// edit job
const editJob = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };

        // find the user 
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user || user.role === "jobseeker") {
            return res.status(400).json({ statusCode: 400, message: "User not found and You are not elligeable to post the job" })
        }

        // get the data from req.body
        const { jobId, title, description, location, salary, employmentType, experienceLevel, skillsRequired, openings, applicationDeadline, isRemote, status } = req.body
        const { min_salary, max_salary, currency } = salary || {}

        // find the job is exist
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(400).json({ statusCode: 400, message: "Job is not exist" })
        }

        // validate job data
        const verifyData = validateJobPostData(req.body);
        if (!verifyData.valid) {
            return res.status(400).json({ statusCode: 400, message: verifyData.errors })
        }

        if (job.company.equals(user.id)) {
            job.title = title;
            job.description = description;
            job.location = location;
            job.salary.min_salary = min_salary;
            job.salary.max_salary = max_salary;
            job.salary.currency = currency;
            job.employmentType = employmentType;
            job.experienceLevel = experienceLevel;
            job.skillsRequired = skillsRequired;
            job.openings = openings;
            job.applicationDeadline = applicationDeadline;
            job.isRemote = isRemote;
            job.status = status
        }
        await job.save()

        return res.status(200).json({ statusCode: 200, message: "Job edit successfully", data: job })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to edit the job", error: error.message })
    }
}

// delete job 
const deleteJob = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };

        // find the user 
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user || user.role === "jobseeker") {
            return res.status(400).json({ statusCode: 400, message: "User not found and You are not elligeable to post the job" })
        }

        const { jobId } = req.body

        // find the job is exist
        await Job.findByIdAndDelete(jobId)

        return res.status(200).json({ statusCode: 200, message: "Job delete successfully", })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to delete the job", error: error.message })
    }
}

// get job through :id
const getJob = async (req, res) => {
    try {
        const { jobId } = req.params

        // find the job is exist
        const job = await Job.findById(jobId).populate({
            path: "company",
            select: "avatar companyInfo.companyName companyInfo.companyDescription companyInfo.companyType companyInfo.companyWeb"
        });

        if (!job) {
            return res.status(400).json({ statusCode: 400, message: "job is not found" })
        }

        return res.status(200).json({ statusCode: 200, message: "Job get successfully", data: job })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to get the job", error: error.message })
    }
}

// get all job of user post token required
const getAllJobs = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };

        // find the user 
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user || user.role === "jobseeker") {
            return res.status(400).json({ statusCode: 400, message: "User not found and You are not elligeable to post the job" })
        }

        // find the job is exist
        const job = await Job.find({ company: user.id }).sort({ createdAt: -1 })

        if (!job || job.length === 0) {
            return res.status(400).json({ statusCode: 400, message: "No jobs found for this company." });
        }

        return res.status(200).json({ statusCode: 200, message: "all Job get successfully", data: job })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to get the job", error: error.message })
    }
}

const allJob = async (req, res) => {
    try {
        const job = await Job.find().populate({
            path: "company",
            select: "companyInfo.companyName companyInfo.companyDescription companyInfo.companyType companyInfo.companyWeb"
        })

        if (!job || job.length === 0) {
            return res.status(400).json({ statusCode: 400, message: "No jobs found for this company." });
        }

        return res.status(200).json({ statusCode: 200, message: "all Job get successfully", data: job })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to get the job", error: error.message })
    }
}

export { postJob, editJob, deleteJob, getJob, getAllJobs, allJob }