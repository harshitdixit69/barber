
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const Contact = require('../schema/contact');
const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();

app.use(express.static(publicDir));
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

const setContact = async (req, res) => {

    const data = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        message: req.body.message
    })

    Contact.create(data)
    res.render('contact')
}
module.exports = setContact