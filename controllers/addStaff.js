const staff = require('../schema/staff')

const addStaff = async (req, res) => {
    const response = await staff.create(req.body)
    res.send(response)
}

module.exports = addStaff