const Joi = require('joi');
const review = require('./models/review');
module.exports.Listingschema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null)
    }).optional()
  }).required()
});

module.exports.ReviewSchema = Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
  }).required()
});