const fetchSlot = require('../fetchSlot')
const moment = require('moment')

const getNextAvailableSlot = async (req, res) => {
    let name, staf, venue, date
    name = req.body.name
    staf = req.body.staff
    venue = req.body.venue
    date = moment(req.body.date).format('YYYY-MM-DD')

    let response_appointment = []
    while (response_appointment.length == 0) {
        date = moment(date).add('1', 'day').format('YYYY-MM-DD')
        response_appointment = await fetchSlot(date, name, venue, staf)
    }
    console.log(response_appointment)
    res.json({ status: "ok", data: response_appointment, date })
}

module.exports = getNextAvailableSlot