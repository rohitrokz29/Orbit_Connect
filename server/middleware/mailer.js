const nodemailer = require('nodemailer');

require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

const ForgotPasswordMail = async ({ email, token_id }) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: 'Orbit Connect Password Reset',
            html: `Dear User,<br> Click on the below link to reset your Orbit Connect password <br>${process.env.ACCESS_ORIGIN}/reset/${token_id}/<br> Thank You <br> Orbit Connect`
        };
        console.log(mailOptions);
        return transporter.sendMail(mailOptions).then(info => true).catch(info => false)

    } catch (error) {
        return false;
    }
}
module.exports = {
    // RoomCreateMail,
    ForgotPasswordMail
}