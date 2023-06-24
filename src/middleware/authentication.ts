import passport from 'passport'
import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

function authentication (req: Request, res: Response, next: NextFunction): any {
  return passport.authenticate('jwt', { session: false })(req, res, next)
}

function validateJwt (req: Request, res: Response, next: NextFunction): any {
  const { token } = req.query
  if (token !== undefined) {
    try {
      const pureToken = (token as string).split(' ')
      jwt.verify(pureToken[1], process.env.TOKEN_KEY as string, { ignoreExpiration: true })
      next()
      return
    } catch (err) {
      return res.status(403).send() // invalid token
    }
  } else {
    return res.status(401).send('invalid request')
  }
}

export { authentication, validateJwt }
