const port = 7855
export const userAuth = {
    register : `http://localhost:${port}/user/register`,
    verify_register : `http://localhost:${port}/user/verify-register`,
    resendCode : `http://localhost:${port}/user/resend-code`,
    login : `http://localhost:${port}/user/login`,
    logOut : `http://localhost:${port}/user/logOut`
}