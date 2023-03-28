import express, { type NextFunction, type Request, type Response } from 'express'
import passport from 'passport'
import IndividualController from '../controllers/individualController'
import { upload } from '../services/multer'
const router = express.Router()

const individualController = new IndividualController()

router.post('/add',
  (req: Request, res: Response, next: NextFunction) => {
    individualController.validateIndividual(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  }
  , (req: Request, res: Response, next: NextFunction) => {
    individualController.addIndividual(req.body)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.post('/login',
  (req: Request, res: Response, next: NextFunction) => {
    individualController.validateLogin(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  }
  , (req: Request, res: Response, next: NextFunction) => {
    individualController.loginIndividual(req.body)
      .then(async (result) => {
        res.status(200).json(result)
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.get('/get', passport.authenticate('jwt', { session: false }), (req: Request, res: Response, next: NextFunction) => {
  individualController.getIndividual(req.user)
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

router.post('/saveordeletejob',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    individualController.validateSaveJob(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  },
  (req: Request, res: Response, next: NextFunction) => {
    individualController.saveOrDeleteJob(req.body.id, req.user)
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

router.post('/image',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, function (error) {
      if (error !== undefined) {
        console.log(error.message)
        next(error)
      }
      res.status(200).json({ message: 'success' })
    })
  }
)
export default router
