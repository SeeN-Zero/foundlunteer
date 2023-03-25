import Joi from 'joi'

const addJobSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().required()
})

const updateJobSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(5).required(),
  description: Joi.string().required()
})

const deleteJobSchema = Joi.object({
  id: Joi.string().required()
})

export { addJobSchema, updateJobSchema, deleteJobSchema }
