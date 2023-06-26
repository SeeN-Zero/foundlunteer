import Joi from 'joi'

const updateIndividualSchema = Joi.object({
  name: Joi.string().min(3).max(32),
  address: Joi.string().min(10).max(100),
  phone: Joi.string().min(10).max(12).regex(/^\d+$/),
  birthOfDate: Joi.date(),
  description: Joi.string(),
  social: Joi.string()
})

export { updateIndividualSchema }
