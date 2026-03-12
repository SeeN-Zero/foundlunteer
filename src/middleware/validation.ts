import { type NextFunction, type Request, type Response } from 'express'
import { addUserSchema, changePasswordSchema, forgotPasswordSchema, loginUserSchema } from './validation/userSchema'
import createHttpError from 'http-errors'
import { updateOrganizationSchema, updateRegistrantStatusSchema } from './validation/organizationSchema'
import { addJobSchema, updateJobSchema, updateJobStatusSchema } from './validation/jobSchema'
import { updateIndividualSchema } from './validation/individualSchema'

function getErrorMessage (error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Validation failed'
}

function validateUser (req: Request, res: Response, next: NextFunction): void {
  addUserSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateLogin (req: Request, res: Response, next: NextFunction): void {
  loginUserSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateForgotPassword (req: Request, res: Response, next: NextFunction): void {
  forgotPasswordSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateChangePassword (req: Request, res: Response, next: NextFunction): void {
  changePasswordSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateOrganizationUpdate (req: Request, res: Response, next: NextFunction): void {
  updateOrganizationSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateIndividualUpdate (req: Request, res: Response, next: NextFunction): void {
  updateIndividualSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateJob (req: Request, res: Response, next: NextFunction): void {
  addJobSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateJobUpdate (req: Request, res: Response, next: NextFunction): void {
  updateJobSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateJobUpdateStatus (req: Request, res: Response, next: NextFunction): void {
  updateJobStatusSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
    })
}

function validateRegistrantUpdateStatus (req: Request, res: Response, next: NextFunction): void {
  updateRegistrantStatusSchema.validateAsync(req.body)
    .then(() => {
      next()
    }).catch(error => {
      next(createHttpError(400, getErrorMessage(error)))
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
  validateJobUpdate,
  validateJobUpdateStatus,
  validateRegistrantUpdateStatus
}
