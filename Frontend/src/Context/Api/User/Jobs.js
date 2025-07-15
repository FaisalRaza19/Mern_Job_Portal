import { job } from "../Api's.js"

const postJob = async (formData) => {
    try {
        console.log(formData)
        const token = localStorage.getItem("user_token")
        const response = await fetch(job.postJob, {
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
            return { message: errorDetails.message.message || errorDetails.message };
        }
        const data = await response.json();
        console.log(data)
        return data
    } catch (error) {
        return error.message
    }
}

export { postJob }