const mongoose = require('mongoose')
const { head } = require('lodash')

const Schema = mongoose.Schema

const Contact = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String },
    message: { type: String }
}
)

const getLastDocument = (Document) => Document.find({}).limit(1).sort({ _id: -1 }).exec();
Contact.pre('save', async function preSave(next) {
    let lastDoc = await getLastDocument(this.constructor);
    lastDoc = lastDoc ? head(lastDoc) : null;
    this._id = lastDoc ? Number(lastDoc._id) + 1 : 1;
    this.id = lastDoc ? Number(lastDoc.id) + 1 : 1;
    return next();
});
const contact = mongoose.model('contact', Contact)
module.exports = contact