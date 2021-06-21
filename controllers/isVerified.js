const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

require('dotenv').config()
const User = require('../schema/imageSchema');
require('../config/db')
const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();

app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

const isVerified = async (req, res) => {
    let flag = 0;
    const otp = req.body.otp
    const email = req.params.email
    console.log(otp, email)
    User.findOne({ email }, (err, doc) => {
        console.log('Email', email)
        if (otp == doc.genOtp) {
            User.findOneAndUpdate({ email }, ({ isVerified: true }), { new: true }, (err, doc) => {
                console.log(doc)
                res.render('login')
            })
        }
        else
            res.send("OTP is Invalid")
    })
}
module.exports = isVerified