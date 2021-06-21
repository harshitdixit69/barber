const mongoose = require('mongoose')
const { head } = require('lodash')

const Schema = mongoose.Schema

const Service = new Schema({
    staff: [Number],
    venue: { type: Number, required: true },
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true }
}
)

const getLastDocument = (Document) => Document.find({}).limit(1).sort({ _id: -1 }).exec();
Service.pre('save', async function preSave(next) {
    let lastDoc = await getLastDocument(this.constructor);
    lastDoc = lastDoc ? head(lastDoc) : null;
    this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
    this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
    return next();
});
const service = mongoose.model('service', Service)
module.exports = service