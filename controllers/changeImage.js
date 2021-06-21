const express = require('express')
const app = express()
const router = express.Router();
const fs = require('fs')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
require('dotenv').config()
const User = require('../schema/imageSchema');

const publicDir = require('path').join(__dirname, '/public');

app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);


const changeImage = async (req, res) => {
    const image = req.params.image
    const img = req.file.filename
    await User.findOneAndUpdate({ image }, { image: img }, { new: true }).then((doc) => {
        res.render('profile', {doc})
    })
}
module.exports = changeImage