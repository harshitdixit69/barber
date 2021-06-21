const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

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

const confirmPasssword = async (req, res) => {
    const email = req.params.email
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt)
    await User.findOneAndUpdate({ email }, ({ password }), { new: true }, (err, doc) => {
        // res.json({ status: "ok" })
        res.render('login')
    })
}
module.exports = confirmPasssword