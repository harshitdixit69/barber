const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const User = require('../schema/imageSchema');
const jwt=require('jsonwebtoken')
const publicDir = require('path').join(__dirname, '/public');
const router = express.Router();

app.use(express.static(publicDir));
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

const addUserr = async (req, res) => {

    const email = req.body.email
    const password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt)
    const token = generateAccessToken({ email});
    const data = new User({
        name: (req.body.name).toLowerCase(),
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: pass,
        token:token,
        genOtp: Math.floor(1000 + Math.random() * 9000),
        image: req.file.filename

    })
    User.find({ email, password }, async (err, doc) => {
        if (err) throw err
        await User.create(data)
        const output = `
            <p>New Account Creating Request</p>
            <h3>Verify your Account</h3>
            <p>${data.genOtp}</p>
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
                from: '"Create Account" harshitdixit65@gmail.com', // sender address
                to: data.email, // list of receivers
                subject: 'Get OTP', // Subject line
                text: 'Hiii....?', // plain text body
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.render('verify', { data });
            });
      
    });
}
function generateAccessToken(username) {
    return jwt.sign(username, process.env.JWT, { expiresIn: '1800s' });
  }
module.exports = addUserr