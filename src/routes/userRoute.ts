import express, { type NextFunction, type Request, type Response } from 'express'
import UserController from '../controllers/userController'
import passport from 'passport'
import { upload } from '../services/Configuration/multer'

const router = express.Router()

const userController = new UserController()

router.post('/add',
  (req: Request, res: Response, next: NextFunction) => {
    userController.validateUser(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  }
  , (req: Request, res: Response, next: NextFunction) => {
    userController.addUser(req.body)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  })
router.post('/login',
  (req: Request, res: Response, next: NextFunction) => {
    userController.validateLogin(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  }
  , (req: Request, res: Response, next: NextFunction) => {
    userController.loginUser(req.body)
      .then(async (result) => {
        res.status(200).json(result)
      })
      .catch(async (error) => {
        next(error)
      })
  })

router.get('/get',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    userController.getUser(req.user)
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
        next(error)
      }
      res.status(200).json({ message: 'success' })
    })
  }
)

router.get('/getimage',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    userController.getUserImage(req.user)
      .then(async (result) => {
        res.sendFile(result, (error) => {
          if (error !== undefined) {
            res.status(404).json({ message: 'Image Not Found' })
          }
        })
      })
      .catch(async (error) => {
        next(error)
      })
  }
)

router.post('/sendcode',
  (req: Request, res: Response, next: NextFunction) => {
    userController.sendCode(req.body)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  }
)

router.post('/forgotpassword',
  (req: Request, res: Response, next: NextFunction) => {
    userController.validateForgotPassword(req.body)
      .then(async () => {
        next()
      })
      .catch(async (error) => {
        next(error)
      })
  },
  (req: Request, res: Response, next: NextFunction) => {
    userController.forgotPassword(req.body)
      .then(async () => {
        res.status(200).json({ message: 'success' })
      })
      .catch(async (error) => {
        next(error)
      })
  }
)
export default router
