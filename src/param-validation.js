const Joi = require("joi");

module.exports ={
    // POST /api/measures
    createUser: {
        body: {
            username: Joi.string().required(),
        },
    },

    // UPDATE /api/measures/:userId
    updateUser: {
        body: {
            username: Joi.string().required(),
        },
        params: {
            userId: Joi.string().hex().required(),
        },
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
};
