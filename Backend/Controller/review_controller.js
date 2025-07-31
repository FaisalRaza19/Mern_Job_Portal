import { User } from "../Models/user_model.js";

// add reviews
const addReview = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user || user.role === "employer") {
            return res.status(400).json({ statusCode: 400, message: "Only job seekers can apply for a job", });
        }

        const { companyId } = req.params
        const { title, rating, comment, } = req.body

        // validate data 
        if (!companyId || !rating || !comment) {
            return res.status(400).json({ statusCode: 400, message: "All required fields must be filled." });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ statusCode: 400, message: "Rating must be a number between 1 and 5." });
        }

        if (comment.length < 10) {
            return res.status(400).json({ statusCode: 400, message: "Comment must be at least 10 characters long." });
        }

        // first find the company
        const company = await User.findById(companyId).select("-password -refreshToken")

        if (!company || company.role !== "employer") {
            return res.status(400).json({ statusCode: 400, message: "company not found", });
        }

        // check review already exist
        const existing = company.companyInfo.companyReviews.some((e) => e?.userId && e?.userId.equals(userId))
        if (existing) {
            return res.status(400).json({ statusCode: 400, message: "You’ve already submitted a review for this company." });
        }

        company.companyInfo.companyReviews.push({
            userId: userId,
            title,
            comment,
            rating,
        });

        await company.save()
        return res.status(200).json({ statusCode: 200, message: "review add successfully", })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while give the review", error: error.message });
    }
}

// edit reviews
const editReview = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user || user.role === "employer") {
            return res.status(400).json({ statusCode: 400, message: "Only job seekers can apply for a job", });
        }

        const { companyId } = req.params
        const { reviewId, title, rating, comment, } = req.body

        // validate data 
        if (!companyId || !reviewId || !rating || !comment) {
            return res.status(400).json({ statusCode: 400, message: "All required fields must be filled." });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ statusCode: 400, message: "Rating must be a number between 1 and 5." });
        }

        if (comment.length < 10) {
            return res.status(400).json({ statusCode: 400, message: "Comment must be at least 10 characters long." });
        }

        // first find the company
        const company = await User.findById(companyId).select("-password -refreshToken")

        if (!company || company.role !== "employer") {
            return res.status(400).json({ statusCode: 400, message: "company not found", });
        }

        // check review already exist
        const existing = company.companyInfo.companyReviews.find((e) => e.userId.equals(userId) && e._id.equals(reviewId))
        if (!existing) {
            return res.status(400).json({ statusCode: 400, message: "Review did not exist in this company" });
        }

        if (title) existing.title = title
        if (rating) existing.rating = rating
        if (comment) existing.comment = comment

        await company.save()
        return res.status(200).json({ statusCode: 200, message: "review edit successfully", })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while edit the review", error: error.message });
    }
}

// delete review
const delReview = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User not found" });
        }

        // Find user
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user || user.role === "employer") {
            return res.status(400).json({ statusCode: 400, message: "Only job seekers can apply for a job", });
        }

        const { companyId } = req.params
        const { reviewId } = req.body

        // validate data 
        if (!companyId || !reviewId) {
            return res.status(400).json({ statusCode: 400, message: "All required fields must be filled." });
        }

        // first find the company
        const company = await User.findById(companyId).select("-password -refreshToken")

        if (!company || company.role !== "employer") {
            return res.status(400).json({ statusCode: 400, message: "company not found", });
        }

        // check review already exist
        const existingReview = company.companyInfo.companyReviews.find((e) => e.userId.equals(userId) && e._id.equals(reviewId))
        if (!existingReview) {
            return res.status(400).json({ statusCode: 400, message: "Review did not exist in this company" });
        }

        existingReview.deleteOne({ _id: userId })

        await company.save()
        return res.status(200).json({ statusCode: 200, message: "review del successfully", })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while del the review", error: error.message });
    }
}

// get all reviews of company
const getAllReviews = async (req, res) => {
    try {
        const { companyId } = req.params

        // validate data 
        if (!companyId) {
            return res.status(400).json({ message: "company Id is required" });
        }

        // first find the company
        const company = await User.findById(companyId).select("role companyInfo.companyReviews").populate({
            path: "companyInfo.companyReviews.userId",
            select: "avatar.avatar_Url jobSeekerInfo.fullName"
        })

        if (!company || company.role !== "employer") {
            return res.status(400).json({ statusCode: 400, message: "company not found", });
        }

        return res.status(200).json({ statusCode: 200, message: "all reviews get successfully", data: company })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Something went wrong while get the reviews", error: error.message });
    }
}
export { addReview, editReview, delReview, getAllReviews }