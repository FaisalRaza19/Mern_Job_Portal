import { User } from "../Models/user_model.js";
import { Job } from "../Models/job_model.js";
import { application_Notification } from "../utility/emailVerification.js";
import { fileUploadOnCloudinary, removeFileFromCloudinary, } from "../utility/fileUpload_remove.js";

const applyJob = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user || user.role === "employer") {
            return res.status(403).json({ statusCode: 403, message: "Only job seekers can apply for a job", });
        }

        const { expectedSalary, coverLetter, jobId, existResume } = req.body;
        if (!jobId || !coverLetter) {
            return res.status(400).json({
                statusCode: 400, message: "All fields are required",
            });
        }

        if (coverLetter.trim().length < 50) {
            return res.status(400).json({ statusCode: 400, message: "Cover letter must be at least 50 characters", });
        }

        // fin the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({ statusCode: 400, message: "Job not found" })
        }

        // check alredy for applied 
        const existingApplication = job.applicants.find((e) => e?.User && e.User.equals(user.id))

        if (existingApplication) {
            return res.status(400).json({ statusCode: 400, message: "You already apliead for the job" })
        }

        const isAlreadySaved = user.jobSeekerInfo.savedJobs.find((e) => e.jobId.equals(job.id))
        if (!existResume) {
            const resume = req.files?.resume?.[0]?.path
            if (!resume) {
                return res.status(400).json({ statusCode: 400, message: "resume is required" })
            }

            // upload on cloudinary
            const folder = "Job Portal/Application Resume";
            const fileUpload = await fileUploadOnCloudinary(resume, folder);
            console.log(fileUpload.url)
            job.applicants.push({
                User: user.id,
                resumeUrl: {
                    resume_Url: fileUpload.url,
                    resume_PublicId: fileUpload.public_id,
                    file_name: fileUpload.original_filename,
                },
                coverLetter,
                expectedSalary,
            })
            await job.save()
            user.jobSeekerInfo.appliedJobs.push({
                jobId: job.id,
                isSaved: isAlreadySaved.isSaved === true ? true : false,
                isApplied: true,
            })
            if (isAlreadySaved.isSaved === true) {
                isAlreadySaved.isApplied = true
            }
            await user.save()
            return res.status(200).json({ statusCode: 200, message: "Application send successfully" })
        }

        job.applicants.push({
            User: user.id,
            resumeUrl: {
                resume_Url: existResume,
            },
            coverLetter,
            expectedSalary,
        })
        await job.save()
        user.jobSeekerInfo.appliedJobs.push({
            jobId: job.id,
            isSaved: isAlreadySaved.isSaved === true ? true : false,
            isApplied: true,
        })
        if (isAlreadySaved.isSaved === true) {
            isAlreadySaved.isApplied = true
        }
        await user.save()
        return res.status(200).json({ statusCode: 200, message: "Application send successfully" })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500, message: "Something went wrong while applying for the job", error: error.message,
        });
    }
};

// save the job
const saveJob = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user || user.role === "employer") {
            return res.status(403).json({ statusCode: 403, message: "Only job seekers can apply for a job", });
        }

        const { jobId } = req.body

        // fin the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({ statusCode: 400, message: "Job not found" })
        }

        // check if job present in saved job
        const savedJob = user.jobSeekerInfo.savedJobs.find((e) => e.jobId && e.jobId.equals(job.id))
        const isAppliedJob = user.jobSeekerInfo.appliedJobs.find((e) => e?.jobId && e.jobId.equals(job.id))
        if (savedJob?.isSaved === true) {
            savedJob.deleteOne({ "jobId": job.id })
            if (isAppliedJob?.isApplied === true) {
                isAppliedJob.isSaved = false
            }
            await user.save()
            return res.status(200).json({ statusCode: 200, message: "Job unSaved Successfully", })
        }

        user.jobSeekerInfo.savedJobs.push({
            jobId: job.id,
            isSaved: true,
            isApplied: isAppliedJob?.isApplied === true ? true : false
        })
        if (isAppliedJob?.isApplied === true) {
            isAppliedJob.isSaved = true
        }

        await user.save();

        return res.status(200).json({ statusCode: 200, message: "Job Saved Successfully", })

    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while save the job", error: error.message });
    }
}

// get saved and applied jobs
const getSavedAndAppliedJobs = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("jobSeekerInfo.savedJobs jobSeekerInfo.appliedJobs")
            .populate({
                path: "jobSeekerInfo.savedJobs.jobId",
                populate: {
                    path: "company",
                    select: "companyInfo.companyName"
                }
            })
            .populate({
                path: "jobSeekerInfo.appliedJobs.jobId",
                populate: {
                    path: "company",
                    select: "companyInfo.companyName"
                }
            });

        if (!user || user.role === "employer") {
            return res.status(403).json({ statusCode: 403, message: "Only job seekers can apply for a job", });
        }

        return res.status(200).json({ statusCode: 200, message: "saved Jobs get successfully", data: user })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while getting the save job", error: error.message });
    }
}

// change the user job application status and send the email
const changeApplicationStatus = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken")

        if (!user || user.role === "jobseeker") {
            return res.status(403).json({ statusCode: 403, message: "Only employeer can do this", });
        }

        // get data from the req.body 
        const { jobId, applicationId, status } = req.body
        if (!jobId || !applicationId || !status) {
            return res.status(400).json({ statusCode: 400, message: "all fields are required" })
        }

        // find the job 
        const job = await Job.findById(jobId).populate({ path: "company", select: "avatar companyInfo.companyName" })
        if (!job) {
            return res.status(400).json({ statusCode: 400, message: "job is not found" })
        }

        // find the application in job
        const application = job.applicants.find((e) => e._id.equals(applicationId))
        application.status = status
        await job.save()

        // get email
        const email = await User.findById(application.User).select("-password -refreshToken")

        // send notification email
        // email, name, status, jobTitle, companyName, companyLogo
        const emailData = {
            email: email.email,
            name: email.jobSeekerInfo.fullName,
            status,
            jobTitle: job.title,
            companyName: job.company.companyInfo.companyName,
            companyLogo: job.company.avatar.avatar_Url,
        }
        const sendEmail = await application_Notification({ emailData })
        if (!sendEmail) {
            return res.status(500).json({ statusCode: 500, message: "Something went wrong to send email" })
        }

        return res.status(200).json({ statusCode: 200, message: "status update successfully" })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while change the application status", error: error.message });
    }
}

export { applyJob, saveJob, getSavedAndAppliedJobs, changeApplicationStatus };