const express = require('express')
const app = express()
require('dotenv').config()
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
require('dotenv').config()
const User = require('../schema/imageSchema');
const jwt = require('jsonwebtoken')


const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();

app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

const findUser = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email }, async (err, doc) => {
        const token = generateAccessToken({ email });
        res.cookie('name', token)
        console.log('password', password, 'doc Password', doc.password, 'doc isverfies', doc.isVerified)
        const valid = await bcrypt.compare(password, doc.password)
        if (valid && doc.isVerified == true) {
            console.log("entered")
            res.render('home', { doc });
        } else {
            console.log("error")
            res.render('login')
        }
    });
}
function generateAccessToken(username) {
    return jwt.sign(username, process.env.JWT)
}
module.exports = findUser