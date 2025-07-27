import { review } from "../Api's.js"

// get all reviews
export const getAllReviews = async (companyId) => {
    try {
        const response = await fetch(`${review.getAllReview}/${companyId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails };
        }
        const data = await response.json();
        return data
    } catch (error) {
        return error.message
    }
}

// add review
export const addReview = async ({ companyId, formData }) => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(`${review.addReview}/${companyId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify(formData),
            credentials: "include"
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails };
        }
        const data = await response.json();
        return data
    } catch (error) {
        return error.message
    }
}

// edit review
export const editReview = async ({ companyId, formData }) => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(`${review.editReview}/${companyId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify(formData),
            credentials: "include"
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails };
        }
        const data = await response.json();
        return data
    } catch (error) {
        return error.message
    }
}

// del review 
export const delReview = async (companyId, reviewId) => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(`${review.delReview}/${companyId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({reviewId}),
            credentials: "include"
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails };
        }
        const data = await response.json();
        return data
    } catch (error) {
        return error.message
    }
}

