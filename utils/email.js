const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (email, code) => {
    try {
        console.log('Sending email with code:', code);
        const mailOptions = {
            from: 'your-email@example.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${code}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Email yuborildi:', email);
    } catch (error) {
        console.error('Email yuborishda xatolik:', error);
    }
};

module.exports = { sendEmail };
