import express, { type NextFunction, type Request, type Response } from 'express'
import passport from 'passport'
import JobController from '../controllers/jobController'
const router = express.Router()

const jobController = new JobController()

router.post('/add',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    jobController.validateJob(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  }
  , (req: Request, res: Response, next: NextFunction) => {
    jobController.addJob(req.body, req.user)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.get('/getAll', passport.authenticate('jwt', { session: false }), (req: Request, res: Response, next: NextFunction) => {
  jobController.getAllJob()
    .then(async (result) => {
      res.status(200).json(result)
    })
    .catch(async (error) => {
      next(error)
    })
})

router.post('/update',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    jobController.validateUpdate(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  },
  (req: Request, res: Response, next: NextFunction) => {
    jobController.updateJob(req.body, req.user)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.delete('/delete',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    jobController.validateDelete(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  },
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body
    jobController.deleteJob(id, req.user)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

export default router
