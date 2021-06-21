const venue = require('../schema/venue')

const addVenue = async (req, res) => {
    const response = await venue.create(req.body)
    res.send(response)
}

module.exports = addVenue