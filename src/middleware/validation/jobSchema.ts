import Joi from 'joi'

const addJobSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().required()
})

const updateJobSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().required()
})

export { addJobSchema, updateJobSchema }
