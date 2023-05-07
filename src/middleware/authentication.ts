import passport from 'passport'
import { type NextFunction, type Request, type Response } from 'express'

function authentication (req: Request, res: Response, next: NextFunction): any {
  return passport.authenticate('jwt', { session: false })(req, res, next)
}

export { authentication }
