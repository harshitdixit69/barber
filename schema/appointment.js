const mongoose = require('mongoose')
const { head } = require('lodash')

const Schema = mongoose.Schema

const Appointment = new Schema({
    name: { type: String, required: true },
    staff: { type: Number, required: true },
    venue: { type: Number, required: true },
    service: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true }
    /*
        staff: from to
        appointment: from to
        
        staff from: == appointment from:
        10 11:30
        res = 11:30 + duration = 12
        staff from < res 

        S10:00  A10:00 A:to:10:30
        S+30
        10:30
        10:30 + 30 = 11:00
        11:00 == A-from
        res + 30 = 12:30

    */
}
)

const getLastDocument = (Document) => Document.find({}).limit(1).sort({ _id: -1 }).exec();
Appointment.pre('save', async function preSave(next) {
    let lastDoc = await getLastDocument(this.constructor);
    lastDoc = lastDoc ? head(lastDoc) : null;
    this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
    this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
    return next();
});
const appointment = mongoose.model('appointment', Appointment)
module.exports = appointment