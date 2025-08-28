const apiUrl = import.meta.env.VITE_API_URL
export const userAuth = {
    register: `${apiUrl}/user/register`,
    verify_register: `${apiUrl}/user/verify-register`,
    resendCode: `${apiUrl}/user/resend-code`,
    login: `${apiUrl}/user/login`,
    logOut: `${apiUrl}/user/logOut`,
    getUser: `${apiUrl}/user/get-user`,
    updateAvatar: `${apiUrl}/user/change-avatar`,
    verifyJWT: `${apiUrl}/user/verify-jwt`,
    editProfile: `${apiUrl}/user/edit-profile`,
    verify_edit: `${apiUrl}/user/verify-profile`,
    // update edu and exp
    update_edu_exp: `${apiUrl}/user/update-edu-exp`,
    update_skills_resume: `${apiUrl}/user/update-skills-resume`,
    // forget pass
    email_pass: `${apiUrl}/user/email-pass`,
    update_pass: `${apiUrl}/user/change-pass`
}

export const job = {
    postJob: `${apiUrl}/jobs/postJob`,
    editJob: `${apiUrl}/jobs/editJob`,
    // chnage job status
    changeStatus: `${apiUrl}/jobs/changeStatus`,
    delJob: `${apiUrl}/jobs/delJob`,
    getJob: `${apiUrl}/jobs/getJob/jobId=`,
    getAllJob: `${apiUrl}/jobs/getAllJob`,
    allJob: `${apiUrl}/jobs/allJob`,
    applyJob: `${apiUrl}/jobs/applyJob`,
    saveJob: `${apiUrl}/jobs/saveJob`,
    getSaved_Applied_Jobs: `${apiUrl}/jobs/get-Saved-applied-Jobs`,
    changeApplicationStatus: `${apiUrl}/jobs/change-status`,
    // get all companies
    allCompanies: `${apiUrl}/jobs/allCompanies`,
    companyAllJobs: `${apiUrl}/jobs/companiesAllJobs`
}

export const review = {
    addReview: `${apiUrl}/review/addReview`,
    editReview: `${apiUrl}/review/editReview`,
    delReview: `${apiUrl}/review/delReview`,
    getAllReview: `${apiUrl}/review/getReview`
}

export const chat = {
    getAllChats: `${apiUrl}/chat/getAllChats`,
    getChatMessages: `${apiUrl}/chat/getChatMessages`,
}
