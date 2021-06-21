const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require('../schema/imageSchema');

require('dotenv').config()
require('../config/db')
const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();

app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);
const setotp = (req, res) => {
    const email = req.body.email
    const otp = Math.floor(1000 + Math.random() * 9000)
    User.findOneAndUpdate({ email }, ({ genOtp: otp }), { new: true }, (err, doc) => {
        console.log("doc", doc);
    })
    const output = `
            <p>Change Password</p>
            <h3>Verify Details</h3>
            <p>${otp}</p>
          `;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'harshitdixit65@gmail.com',
            pass: '8318090007'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"BarberShop" harshitdixit65@gmail.com', 
        to: email, 
        subject: 'OTP Verification ',
        text: 'op verification code for your given main id',
        html: output
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('verifyOtp', { email });
    });
    return otp;
}
module.exports = setotp