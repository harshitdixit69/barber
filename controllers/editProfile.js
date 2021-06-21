const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
require('dotenv').config()
const User = require('../schema/imageSchema');
const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();

app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);


const editProfile = async (req, res) => {
    const email = req.user.email
    await User.findOneAndUpdate({ email }, ({ name: req.body.name, email: req.body.email, phone: req.body.phone, address: req.body.address }), { new: true }).then((doc) => {
        res.render('profile', {doc})
    })
}
module.exports = editProfile