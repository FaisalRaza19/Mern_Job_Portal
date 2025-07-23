import { job } from "../Api's.js"

export const postJobs = async ({ formData }) => {
    try {
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
            return { message: errorDetails };
        }
        const data = await response.json();
        return data
    } catch (error) {
        return error.message
    }
}

// get all jobs of user
export const getAllJobs = async () => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(job.getAllJob, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
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

// get job through id
export const getJobFromId = async ({ jobId }) => {
    try {
        const api = `${job.getJob}${jobId}`
        const response = await fetch(api, {
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

// edit the job 
export const editJob = async ({ updatedJob }) => {
    try {
        console.log(updatedJob)
        const token = localStorage.getItem("user_token")
        const response = await fetch(job.editJob, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify(updatedJob),
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

// delete job 
export const delJob = async (jobId) => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(job.delJob, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({ jobId }),
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

// all jobs present in db
export const allJob = async () => {
    try {
        const response = await fetch(job.allJob, {
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

// apply job
export const applyJob = async ({ formdata }) => {
    try {
        console.log(formdata)
        const form = new FormData();

        form.append("jobId", formdata.jobId);
        form.append("expectedSalary", formdata.expectedSalary);
        form.append("currency", formdata.currency);
        form.append("coverLetter", formdata.coverLetter);

        if (formdata.resume) {
            form.append("resume", formdata.resume);
        } else if (formdata.existResume) {
            form.append("existResume", formdata.existResume);
        }

        console.log(form)
        const token = localStorage.getItem("user_token");

        const response = await fetch(job.applyJob, {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: form,
            credentials: "include",
        });

        console.log(response)

        if (!response.ok) {
            const errorDetails = await response.json();
            return { message: errorDetails };
        }

        const data = await response.json();
        console.log(data)

        return data;
    } catch (error) {
        return { message: error.message };
    }
};

// save job 
export const saveJob = async ({ jobId }) => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(job.saveJob, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            body: JSON.stringify({ jobId }),
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

// get saved and applied jobs
export const saved_applied_jobs = async () => {
    try {
        const token = localStorage.getItem("user_token")
        const response = await fetch(job.getSaved_Applied_Jobs, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
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
