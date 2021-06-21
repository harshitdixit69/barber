const fetchSlot = require('../fetchSlot')
const moment = require('moment')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')

const getService = async (req, res) => {
    let name, staf, venue, date
    name = req.body.name
    staf = req.body.staff
    venue = req.body.venue
    date = moment(req.body.date).format('YYYY-MM-DD')

    let { response_appointment_from, response_appointment_to, price, service_duration } = await fetchSlot(date, name, venue, staf)
    if (response_appointment_from == 0) {
        res.render('SlotNotAvail')
    } else {
        res.render('Slots', { from: response_appointment_from, to: response_appointment_to, name, staf, venue, date, price, service_duration })
    }
}

module.exports = getService