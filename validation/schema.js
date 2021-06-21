const joi = require("@hapi/joi");
const daySchedule = {
    from: joi.string().required(),
    to: joi.string().required()
}

const schema = {
    user: joi.object({
        name: joi.string().required(),
        time: joi.string().required(),
        staf: joi.number().required(),
        venue: joi.number().required(),
        srv: joi.string().required(),
        duration: joi.number().required(),
        date: joi.string().required(),
    }),
    getslot: joi.object({
        name: joi.string().required(),
        staff: joi.number().required(),
        venue: joi.number().required(),
        date: joi.string().required()
    }),

    service: joi.object({

        name: joi.string().required(),
        staff: joi.array().required(),
        venue: joi.number().required(),
        duration: joi.number().required(),
        price: joi.number().required(),

    }),


    staff: joi.object({

        name: joi.string().required(),
        venue: joi.number().required(),
        schedule: {
            monday: daySchedule,
            tuesday: daySchedule,
            wednesday: daySchedule,
            thursday: daySchedule,
            friday: daySchedule,
            saturday: daySchedule,
            sunday: daySchedule,
        }
    }),

    venue: joi.object({

        name: joi.string().required(),

        schedule: {
            monday: daySchedule,
            tuesday: daySchedule,
            wednesday: daySchedule,
            thursday: daySchedule,
            friday: daySchedule,
            saturday: daySchedule,
            sunday: daySchedule,
        }
    }),

}
module.exports = schema;