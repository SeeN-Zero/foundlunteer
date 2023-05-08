import { type NextFunction, type Request, type Response } from 'express'
import { addUserSchema, changePasswordSchema, forgotPasswordSchema, loginUserSchema } from './validation/userSchema'
import createHttpError from 'http-errors'
import { updateOrganizationSchema } from './validation/organizationSchema'
import { addJobSchema, updateJobSchema } from './validation/jobSchema'
import { updateIndividualSchema } from './validation/individualSchema'

function validateUser (req: Request, res: Response, next: NextFunction): void {
  addUserSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateLogin (req: Request, res: Response, next: NextFunction): void {
  loginUserSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateForgotPassword (req: Request, res: Response, next: NextFunction): void {
  forgotPasswordSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateChangePassword (req: Request, res: Response, next: NextFunction): void {
  changePasswordSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateOrganizationUpdate (req: Request, res: Response, next: NextFunction): void {
  updateOrganizationSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateIndividualUpdate (req: Request, res: Response, next: NextFunction): void {
  updateIndividualSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateJob (req: Request, res: Response, next: NextFunction): void {
  addJobSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

function validateJobUpdate (req: Request, res: Response, next: NextFunction): void {
  updateJobSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

export {
  validateUser,
  validateLogin,
  validateForgotPassword,
  validateChangePassword,
  validateOrganizationUpdate,
  validateIndividualUpdate,
  validateJob,
  validateJobUpdate
}
