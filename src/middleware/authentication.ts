import passport from 'passport'
import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

function authentication (req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false })(req, res, next)
}

function validateJwt (req: Request, res: Response, next: NextFunction): void {
  const queryToken = req.query.token
  const token = typeof queryToken === 'string'
    ? queryToken
    : Array.isArray(queryToken) && typeof queryToken[0] === 'string'
      ? queryToken[0]
      : undefined
  const tokenKey = process.env.TOKEN_KEY

  if (tokenKey === undefined) {
    res.status(500).send('TOKEN_KEY is not configured')
    return
  }

  if (token !== undefined) {
    try {
      const normalizedToken = token.startsWith('Bearer ')
        ? token.slice(7)
        : token

      jwt.verify(normalizedToken, tokenKey)
      next()
    } catch {
      res.status(403).send() // invalid token
    }
  } else {
    res.status(401).send('invalid request')
  }
}

export { authentication, validateJwt }
