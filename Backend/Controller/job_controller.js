import { User } from "../Models/user_model.js"
import { Job } from "../Models/job_model.js"
import { validateJobPostData } from "../utility/job_Input_Verifier.js"

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
        const { title, description,location, salary, employmentType, experienceLevel, skillsRequired, openings, applicationDeadline, isRemote } = req.body
        const { min_salary, max_salary, currency } = salary || {}
        console.log(req.body)
        // validate job data
        const verifyData = validateJobPostData(req.body);
        if (!verifyData.valid) {
            return res.status(400).json({ statusCode: 400, message: verifyData.errors })
        }

        // create the job and push it in db
        const job = await Job.create({
            title,
            description,
            company : user._id,
            location : isRemote === true ? null : location,
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

        if(!job){
            return res.status(500).json({statusCode : 400,message:"internal server error to create Job"})
        }

        return res.status(200).json({statusCode : 200,message : "Job create successfully",data : job})
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong to post a job", error: error.message })
    }
}


export {postJob}