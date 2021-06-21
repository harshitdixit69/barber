const { user, getslot, staff, venue, service } = require("./schema.js");

module.exports = {

    adduservalidation: async (req, res, next) => {
        const value = await user.validate(req.body);
        disMessage(value, res, next);
    },
    slotValidation: async (req, res, next) => {
        const value = await getslot.validate(req.body);
        disMessage(value, res, next);
    },
    serviceValidation: async (req, res, next) => {
        const value = await service.validate(req.body);
        disMessage(value, res, next);
    },
    staffValidation: async (req, res, next) => {
        const value = await staff.validate(req.body);
        disMessage(value, res, next);
    },
    venueValidation: async (req, res, next) => {
        const value = await venue.validate(req.body);
        disMessage(value, res, next);
    }


};

function disMessage(value, res, next) {
    if (value.error) {
        res.json({
            success: 0,
            message: value.error.details[0].message
        });
    }
    else { next(); }
}
