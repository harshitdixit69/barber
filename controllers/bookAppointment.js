const moment = require('moment')
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const appointment = require('../schema/appointment')
const { convert_time2, pretty_time } = require('../timeConvert')
const User = require('../schema/imageSchema')
app.set('view engine', 'ejs')

const bookAppointment = async (req, res) => {
    let email = ''
    let name = (req.body.name).toLowerCase()
    let time = req.body.time
    let staf = req.body.staf
    let venu = req.body.venue
    let srv = req.body.srv
    let from = time
    let service_duration = req.body.duration
    let to = pretty_time(convert_time2(from) + (parseInt(service_duration)))
    let date = moment(req.body.date).format('YYYY-MM-DD')
    User.findOne({ name }, async (err, doc) => {
        email = await(doc.email)
    })
    await appointment.findOne({ staff: staf, date, from, to }, async (err, result) => {
        if (result == null) {
            await appointment.create({
                name: name.toLowerCase(),
                staff: staf,
                venue: venu,
                service: srv,
                from: from,
                to: to,
                date: date
            })

            const output = `
            <p>Booked Appointment Details</p>
            <h1>Name-${name}</h1>
            <h1>Staff-${staf}</h1>
            <h1>Venue-${venu}</h1>
            <h1>Service-${srv}</h1>
            <h1>From-${from}:To-${to}</h1>
            <h1>Date-${date}</h1>
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
                from: '"Booked Appointment" harshitdixit65@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Booked Appointment', // Subject line
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

                res.render('AppointmentBooked', { name, staf, venu, srv, from, to, date })
            });

        }

    })

}

module.exports = bookAppointment