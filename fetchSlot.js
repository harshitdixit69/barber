//Importing Libraries
const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const moment = require('moment')
require('./config/db')
//Importing Schemas
const staff = require('./schema/staff')
const service = require('./schema/service')
const appointment = require('./schema/appointment')

const timemanage = require('./timeConvert')

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

async function fetchSlot(date, name, venue, staf) {
    let service_duration
    let wday = moment(date).format('dddd').toLowerCase()

    let response_appointment_from = []
    let response_appointment_to = []

    let found = 0
    let price = 0
    await service.find({ name, venue }, (err, result) => {
        if (err) throw err
        for (let index = 0; index < result[0].staff.length; index++) {
            let element = result[0].staff[index]
            if (element == staf) {
                service_duration = result[0].duration
                price = result[0].price
                found++
                break
            }
        }
    })
    if (found == 0) {
        console.log('staff not available')
    } else {
        let staff_from = ''
        let staff_to = ''
        let appointment_from = []
        await staff.findOne({ _id: staf }, (err, result) => {
            staff_from = result.schedule[`${wday}`].from
            staff_to = result.schedule[`${wday}`].to
        })

        await appointment.find({ staff: staf, date: date }, (err, result) => {
            result.forEach(element => {
                appointment_from.push(timemanage.convert_time2(element.from))
            })
        })
        service_duration = parseInt(service_duration)
        let staff_time_converted = timemanage.convert_time2(staff_from)
        let staff_totime_converted = timemanage.convert_time2(staff_to)
        let start_point = staff_time_converted
        appointment_from.sort()
        let i = 0
        while (start_point < staff_totime_converted) {
            if (start_point != appointment_from[i]) {
                response_appointment_from.push(timemanage.pretty_time(start_point))
                response_appointment_to.push(timemanage.pretty_time(start_point + service_duration))
                start_point += service_duration
            } else {
                i++
                start_point += service_duration
            }
        }
    }

    return { response_appointment_from, response_appointment_to, price, service_duration }
}

module.exports = fetchSlot