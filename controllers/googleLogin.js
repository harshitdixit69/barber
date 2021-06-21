const User = require("../schema/imageSchema");
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(cookieParser());
dotenv.config()
const googleLogin = (req, res) => {
    const token = req.body.token
    let payload = {}
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        payload = ticket.getPayload();
        const userDetail = new User({
            name: payload.name,
            email: payload.email,
            isVerified: payload.email_verified,
            image: 'file_1622496668797.png',
            password: '',
            token: token
        })
        console.log(payload.email_verified);
        User.find({ email: payload.email }).then((result) => {
            if (result.length == 0)
                userDetail.save();
            else
                console.log(payload);
        })
    }
    verify().then(() => {
        res.cookie('session-token', token)
        res.send('success')
    }).catch(console.error);
}
module.exports = googleLogin