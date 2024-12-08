const joi = require("joi");

const listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().min(0).required(),
        image : joi.string().allow("",null)
    }).required()
});

module.exports = listingSchema;

const reviewSchemaJoi = joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required()
    }).required()
}); 

module.exports = reviewSchemaJoi;