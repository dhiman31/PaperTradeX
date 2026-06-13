const nodemailer = require("nodemailer");
const sender = require("../config/emailConfig");

class emailService{

    async sendEmailVerification(email, otp) {
        await sender.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Valid for 5 minutes.</p>
            `,
        });

        console.log(
            `OTP sent to ${email}`
        );
    }

}

module.exports = emailService;