const service = require('../schema/service')

const addService = async (req, res) => {
    const response = await service.create({
        staff: req.body.staff,
        venue: req.body.venue,
        name: req.body.name,
        duration: req.body.duration,
        price: req.body.price
    })
    res.send(response)
}

module.exports = addService