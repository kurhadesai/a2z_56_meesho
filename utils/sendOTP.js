const nodemailer = require('nodemailer');

function getTransporter() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : '';

    if (!emailUser || !emailPass) {
        throw new Error('EMAIL_USER and EMAIL_PASS must be set in .env');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, otp) {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP for email verification is:</p>
                <h1 style="color: #2c3e50;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendOTP, generateOTP };
