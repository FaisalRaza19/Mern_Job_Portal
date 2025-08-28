// import nodemailer from "nodemailer";
// import { verificationEmailHTML, changePasswordEmail, applicationStatusEmailHTML } from "./emailHTML.js";

// // generate verification code
// const generateCode = () => {
//     return Math.floor(100000 + Math.random() * 900000)
// }

// // email for varification
// const sendEmail = async (email) => {
//     try {
//         // create transpoter
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.GMAIL_EMAIL,
//                 pass: process.env.GMAIL_PASSWORD,
//             },
//         });

//         // create verification code 
//         const code = generateCode();
//         console.log("email code", code)

//         // send email 
//         await transporter.sendMail({
//             from: process.env.GMAIL_EMAIL,
//             to: email,
//             subject: "Verify your email",
//             html: verificationEmailHTML(code),
//         })

//         return code;
//     } catch (error) {
//         return new Error("Failed to send verification code");
//     }
// }

// // email for change password
// const pas_Email = async (email, token) => {
//     try {
//         // create transpoter
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.GMAIL_EMAIL,
//                 pass: process.env.GMAIL_PASSWORD,
//             },
//         });

//         const link = `http://localhost:5173/change-password/${token}`
//         // send email 
//         await transporter.sendMail({
//             from: `"JobPortal Pro" <${process.env.GMAIL_EMAIL}>`,
//             to: email,
//             subject: "Verify your email",
//             html: changePasswordEmail(link),
//         })

//         return code;
//     } catch (error) {
//         return new Error("Failed to send verification code");
//     }
// }

// // email for notify for application
// const application_Notification = async ({emailData}) => {
//     try {
//         // create transpoter
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.GMAIL_EMAIL,
//                 pass: process.env.GMAIL_PASSWORD,
//             },
//         });

//         // send email 
//         const data = await transporter.sendMail({
//             from: process.env.GMAIL_EMAIL,
//             to: emailData.email,
//             subject: `Your application for ${emailData.jobTitle} at ${emailData.companyName}`,
//             html: applicationStatusEmailHTML({emailData}),
//         })

//         return data;
//     } catch (error) {
//         return new Error("Failed to send application email");
//     }
// }

// const verifyEmail = (userCode, emailCode) => {
//     if (!userCode || !emailCode) {
//         throw new Error("Verification code is required.");
//     }
//     if (parseInt(userCode) !== parseInt(emailCode)) {
//         throw new Error("Invalid verification code.");
//     }
//     return true;
// }

// export { sendEmail, pas_Email, verifyEmail, application_Notification }



import nodemailer from "nodemailer";
import { verificationEmailHTML, changePasswordEmail, applicationStatusEmailHTML } from "./emailHTML.js";

// Generates a 6-digit random verification code.
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// transpter for email 
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.MAILGUN_SMTP_HOST,
        port: process.env.MAILGUN_SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAILGUN_SMTP_LOGIN,
            pass: process.env.MAILGUN_SMTP_PASSWORD,
        },
    });
};

// send email
const sendEmail = async (email) => {
    const transporter = createTransporter();
    const code = generateCode();

    try {
        // Send email using the Mailgun transporter.
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "Verify your email",
            html: verificationEmailHTML(code),
        });
        console.log(code);
        return code;
    } catch (error) {
        console.error("Failed to send verification email:", error);
        return new Error("Failed to send verification code");
    }
};

// pass email
const pas_Email = async (email, token) => {
    const transporter = createTransporter();
    const link = `${process.env.BASE_URL}/change-password/${token}`;

    try {
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: changePasswordEmail(link),
        });
        return true
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        return new Error("Failed to send password reset email");
    }
};

// aplication email
const application_Notification = async ({ emailData }) => {
    const transporter = createTransporter();
    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: emailData.email,
            subject: `Your application for ${emailData.jobTitle} at ${emailData.companyName}`,
            html: applicationStatusEmailHTML({
                emailData
            }),
        });
        return info;
    } catch (error) {
        console.error("Failed to send application email:", error);
        return new Error("Failed to send application email");
    }
};

// verify email
const verifyEmail = (userCode, emailCode) => {
    if (!userCode || !emailCode) {
        throw new Error("Verification code is required.");
    }
    if (parseInt(userCode) !== parseInt(emailCode)) {
        throw new Error("Invalid verification code.");
    }
    return true;
};

export { sendEmail, pas_Email, verifyEmail, application_Notification };
