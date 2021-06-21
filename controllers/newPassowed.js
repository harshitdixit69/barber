const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

require('dotenv').config()
require('../config/db')
const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();
const newOtp = require('./setOtp');
const User = require('../schema/imageSchema');
app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);
let mainOtp = 0

const newpasssword = async (req, res) => {
    const email = req.params.email
    const otp = req.body.otp
    User.findOne({ email }, async (err, doc) => {
        if (otp == doc.genOtp)
            res.render('newpassgen', { email })
        else
            res.render('verifyOtp', { email })

    });

}
module.exports = newpasssword