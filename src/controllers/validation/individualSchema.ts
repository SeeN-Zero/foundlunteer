import Joi from 'joi'

const addIndividualSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
  name: Joi.string().min(3).max(32).required(),
  address: Joi.string().min(10).max(100).required(),
  phone: Joi.string().min(10).max(12).required(),
  age: Joi.number().min(12).max(100).required()
})

const loginIndividualSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required()
})

const saveJobIndividualSchema = Joi.object({
  id: Joi.string().required()
})
const updateIndividualSchema = Joi.object(({
  name: Joi.string().min(3).max(32),
  address: Joi.string().min(10).max(100),
  phone: Joi.string().min(10).max(12),
  age: Joi.number().min(12).max(100),
  description: Joi.string().required()
  // social: Joi.string().required()
}))

export { addIndividualSchema, loginIndividualSchema, updateIndividualSchema, saveJobIndividualSchema }
