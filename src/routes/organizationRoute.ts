import express, { type NextFunction, type Request, type Response } from 'express'
import passport from 'passport'
import OrganizationController from '../controllers/organizationController'
const router = express.Router()

const organizationController = new OrganizationController()

router.get('/getjob',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    organizationController.getOrganizationJob(req.user)
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
    organizationController.validateUpdate(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  },
  (req: Request, res: Response, next: NextFunction) => {
    organizationController.updateOrganization(req.body, req.user)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.get('/jobdetail/:jobId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    organizationController.getJobDetail(req.params.jobId, req.user)
      .then(async (result) => {
        res.status(200).json(result)
      })
      .catch(async (error) => {
        next(error)
      })
  })

export default router
