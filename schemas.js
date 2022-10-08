const Joi = require('joi');

module.exports.thingSchema = Joi.object({
    thing: Joi.object({
        item1: Joi.string().required(),
        item2: Joi.string().required(),
        item3: Joi.string().required()
    }).required()
});