import Joi from 'joi'

const addUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
  name: Joi.string().min(3).max(64).required(),
  address: Joi.string().min(10).max(100).required(),
  phone: Joi.string().min(10).max(12).regex(/^\d+$/).required(),
  role: Joi.string().valid('individual', 'organization').insensitive().required()
})

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required()
})

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.number().min(1000).max(9999).required(),
  password: Joi.string().min(7).required()
})

export { addUserSchema, loginUserSchema, forgotPasswordSchema }
