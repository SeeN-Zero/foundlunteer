// Dot Environment
import * as dotenv from 'dotenv'

// Express
import express, { type NextFunction, type Request, type Response } from 'express'

// 3rd Library
import 'reflect-metadata'
import logger from 'morgan'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import createHttpError from 'http-errors'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { type Algorithm, type JwtPayload } from 'jsonwebtoken'
import swaggerDocument from '../swagger_output.json' with { type: 'json' }

// Routes
import individualRoute from './routes/individualRoute'
import organizationRoute from './routes/organizationRoute'
import jobRoute from './routes/jobRoute'
import userRoute from './routes/userRoute'

dotenv.config()

if (process.env.TOKEN_KEY === undefined) {
  throw new Error('TOKEN_KEY must be defined')
}

const app = express()

app.use(cors())
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_KEY,
  algorithms: ['HS256'] as Algorithm[],
  ignoreExpiration: false
}

passport.use(new JwtStrategy(opts, (jwtPayload: JwtPayload | string, done: (error: unknown, user?: Express.User | false) => void): void => {
  if (typeof jwtPayload === 'string') {
    done(null, false)
    return
  }
  const { id, role } = jwtPayload
  done(null, { id, role })
}))
app.use(passport.initialize())

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello Foundlunteer!' })
})

app.use('/user', userRoute)
app.use('/individual', individualRoute)
app.use('/organization', organizationRoute)
app.use('/job', jobRoute)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (createHttpError.isHttpError(err)) {
    res.status(err.status).json({ message: err.message })
  } else {
    next()
  }
})

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' })
})

export default app
