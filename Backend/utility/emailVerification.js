import nodemailer from "nodemailer";
import { verificationEmailHTML, changePasswordEmail, applicationStatusEmailHTML } from "./emailHTML.js";

// generate verification code
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

// email for varification
const sendEmail = async (email) => {
    try {
        // create transpoter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // create verification code 
        const code = generateCode();
        console.log("email code", code)

        // send email 
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: "Verify your email",
            html: verificationEmailHTML(code),
        })

        return code;
    } catch (error) {
        return new Error("Failed to send verification code");
    }
}

// email for change password
const pas_Email = async (email, id) => {
    try {
        // create transpoter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const link = `${process.env.BASE_URL}/change-password/${id}`
        console.log(link)
        // send email 
        await transporter.sendMail({
            from: `"JobPortal Pro" <${process.env.GMAIL_EMAIL}>`,
            to: email,
            subject: "Verify your email",
            html: changePasswordEmail(link),
        })

        return code;
    } catch (error) {
        return new Error("Failed to send verification code");
    }
}

// email for notify for application
const application_Notification = async ({emailData}) => {
    try {
        // create transpoter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // send email 
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: emailData.email,
            subject: `Your application for ${emailData.jobTitle} at ${emailData.companyName}`,
            html: applicationStatusEmailHTML({emailData}),
        })

        return "";
    } catch (error) {
        return new Error("Failed to send application email");
    }
}

const verifyEmail = (userCode, emailCode) => {
    if (!userCode || !emailCode) {
        throw new Error("Verification code is required.");
    }
    if (parseInt(userCode) !== parseInt(emailCode)) {
        throw new Error("Invalid verification code.");
    }
    return true;
}

export { sendEmail, pas_Email, verifyEmail, application_Notification }