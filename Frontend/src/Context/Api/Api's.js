const port = 7855
export const userAuth = {
    register : `http://localhost:${port}/user/register`,
    verify_register : `http://localhost:${port}/user/verify-register`,
    resendCode : `http://localhost:${port}/user/resend-code`,
    login : `http://localhost:${port}/user/login`,
    logOut : `http://localhost:${port}/user/logOut`,
    getUser : `http://localhost:${port}/user/get-user`,
    updateAvatar : `http://localhost:${port}/user/change-avatar`,
    verifyJWT : `http://localhost:${port}/user/verify-jwt`,
    editProfile : `http://localhost:${port}/user/edit-profile`,
    verify_edit : `http://localhost:${port}/user/verify-profile`,
    // update edu and exp
    update_edu_exp : `http://localhost:${port}/user/update-edu-exp`
}