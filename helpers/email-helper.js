const TeamModel = require('../models/team');
const UserModel = require('../models/user');
const errorHelper = require("../helpers/error-helper");


const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
    },
});

exports.sendTeamResetPasssword = async (email, token) => {
    const mailOptions = {
        from: "Milan Vasović",
        to: email,
        subject: "Zatražiliste Restartovanje Šifre",
        text: "Zatražiliste Restartovanje Šifre",
        html: `<html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Zatražiliste Restartovanje Šifre</title>
                    </head>
                    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #009688; margin-bottom: 20px;">Restartujte Šifru</h1>
                            <p style="color: #333; font-size: 16px; margin-bottom: 30px;">Vi ste zatražili restartvonaje šifre. Kliknite na link ispod:</p>
                            <a href="http://localhost:3000/nova-sifra/${token}" style="display: inline-block; padding: 12px 24px; background-color: #009688; color: #fff; text-decoration: none; border-radius: 4px; font-size: 16px; transition: background-color 0.3s;">Restartovanje Šifre</a>
                            <p style="color: #333; font-size: 16px; margin-top: 30px;">Ako niste zatražili, ignorišite ovaj email.</p>
                        </div>
                    </body>
                </html>`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject("Email nije poslat");
            } else {
                console.log("Email sent:", info.response);
                resolve(true);
            }
        });
    });
}