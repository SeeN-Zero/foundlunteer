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
import swaggerDocument from '../swagger_output.json' assert { type: 'json' }

// Routes
import individualRoute from './routes/individualRoute'
import organizationRoute from './routes/organizationRoute'
import jobRoute from './routes/jobRoute'
import userRoute from './routes/userRoute'

dotenv.config()

const app = express()

app.use(cors())
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_KEY as string,
  algorithms: ['HS256'],
  ignoreExpiration: true
}

passport.use(new JwtStrategy(opts, (jwtPayload, done): void => {
  const { id, role } = jwtPayload
  done(null, { id, role })
}))

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
