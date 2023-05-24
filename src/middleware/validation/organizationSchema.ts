import Joi from 'joi'

const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(3).max(64),
  address: Joi.string().min(10).max(100),
  phone: Joi.string().min(10).max(12).regex(/^\d+$/),
  leader: Joi.string().min(3).max(32),
  description: Joi.string(),
  social: Joi.string()
})

const updateRegistrantStatusSchema = Joi.object({
  individualId: Joi.string().required(),
  jobId: Joi.string().required(),
  registrantStatus: Joi.string().valid('ONPROCESS', 'REJECTED', 'ACCEPTED').insensitive().required()
})

export { updateOrganizationSchema, updateRegistrantStatusSchema }
