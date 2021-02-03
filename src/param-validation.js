const { Joi } = require("express-validation");

module.exports ={
    // POST /api/measures
    createMeasure: {
        body: Joi.object({
            name: Joi.string().required(),
            displayName: Joi.string().required(),
            eligiblePopulation: Joi.number().required(),
            included: Joi.number().required(),
            rating: Joi.number(),
            percentage: Joi.number().required(),
        }),
    },
};
