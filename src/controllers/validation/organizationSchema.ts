import Joi from 'joi'

const addOrganizationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
  name: Joi.string().min(3).max(64).required(),
  address: Joi.string().min(10).max(100).required(),
  phone: Joi.string().min(10).max(12).required(),
  leader: Joi.string().min(3).max(32).required()

})

const loginOrganizationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required()
})

const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(3).max(64).required(),
  address: Joi.string().min(10).max(100).required(),
  phone: Joi.string().min(10).max(12).required(),
  leader: Joi.string().min(3).max(32).required(),
  description: Joi.string().required()
  // social: Joi.string().required()
})

export { addOrganizationSchema, loginOrganizationSchema, updateOrganizationSchema }
