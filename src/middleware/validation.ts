import { type NextFunction, type Request, type Response } from 'express'
import { addUserSchema, forgotPasswordSchema, loginUserSchema } from './validation/userSchema'
import createHttpError from 'http-errors'
import { updateOrganizationSchema } from './validation/organizationSchema'

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

function validateUpdate (req: Request, res: Response, next: NextFunction): void {
  updateOrganizationSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, error.message))
    })
}

export { validateUser, validateLogin, validateForgotPassword, validateUpdate }
