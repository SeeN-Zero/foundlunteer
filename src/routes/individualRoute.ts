import express, { type NextFunction, type Request, type Response } from 'express'
import passport from 'passport'
import IndividualController from '../controllers/individualController'
const router = express.Router()

const individualController = new IndividualController()

router.post('/update',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    individualController.validateUpdate(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  },
  (req: Request, res: Response, next: NextFunction) => {
    individualController.updateIndividual(req.body, req.user)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.post('/saveordeletejob/:jobId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    individualController.saveOrDeleteJob(req.params.jobId, req.user)
      .then(async (result) => {
        res.status(200).json({ message: result })
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.get('/savedjob',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    individualController.getIndividualSavedJob(req.user)
      .then(async (result) => {
        res.status(200).json(result)
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.get('/registeredjob',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    individualController.getIndividualRegisteredJob(req.user)
      .then(async (result) => {
        res.status(200).json(result)
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.post('/register/:jobId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    individualController.registerIndividualJob(req.user, req.params.jobId)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

export default router
