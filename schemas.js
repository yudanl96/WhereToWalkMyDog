const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');

const placeSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    leash: Joi.boolean().required(),
    img: Joi.string().uri().allow(''),
    description: Joi.string().allow('')
  })

const reviewSchema = Joi.object({
    score: Joi.number().integer().required().min(1).max(5),
    placeId: Joi.string().required(),
    comment: Joi.string().required()
  })

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email()
})

const validateInput = (schemaType)=>{
  return (req,res,next)=>{
    const {error} = schemaType.validate(req.body)
    if(error){
      const msg = error.details.map(x => x.message).join('');
      throw new ExpressError(msg, 400);
    }else{
      next();
    }
  }
}

module.exports = {placeSchema, validateInput, reviewSchema, userSchema}
