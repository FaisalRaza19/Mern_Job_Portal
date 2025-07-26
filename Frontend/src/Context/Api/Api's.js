const port = 7855
export const userAuth = {
    register: `http://localhost:${port}/user/register`,
    verify_register: `http://localhost:${port}/user/verify-register`,
    resendCode: `http://localhost:${port}/user/resend-code`,
    login: `http://localhost:${port}/user/login`,
    logOut: `http://localhost:${port}/user/logOut`,
    getUser: `http://localhost:${port}/user/get-user`,
    updateAvatar: `http://localhost:${port}/user/change-avatar`,
    verifyJWT: `http://localhost:${port}/user/verify-jwt`,
    editProfile: `http://localhost:${port}/user/edit-profile`,
    verify_edit: `http://localhost:${port}/user/verify-profile`,
    // update edu and exp
    update_edu_exp: `http://localhost:${port}/user/update-edu-exp`,
    update_skills_resume: `http://localhost:${port}/user/update-skills-resume`,
}

export const job = {
    postJob: `http://localhost:${port}/jobs/postJob`,
    editJob: `http://localhost:${port}/jobs/editJob`,
    // chnage job status
    changeStatus: `http://localhost:${port}/jobs/changeStatus`,
    delJob: `http://localhost:${port}/jobs/delJob`,
    getJob: `http://localhost:${port}/jobs/getJob/jobId=`,
    getAllJob: `http://localhost:${port}/jobs/getAllJob`,
    allJob: `http://localhost:${port}/jobs/allJob`,
    applyJob: `http://localhost:${port}/jobs/applyJob`,
    saveJob: `http://localhost:${port}/jobs/saveJob`,
    getSaved_Applied_Jobs: `http://localhost:${port}/jobs/get-Saved-applied-Jobs`,
    changeApplicationStatus : `http://localhost:${port}/jobs/change-status`,
    // get all companies
    allCompanies : `http://localhost:${port}/jobs/allCompanies`,
    companyAllJobs : `http://localhost:${port}/jobs/companiesAllJobs`
}