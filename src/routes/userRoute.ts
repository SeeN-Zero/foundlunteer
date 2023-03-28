import express, { type NextFunction, type Request, type Response } from 'express'
import UserController from '../controllers/userController'
import passport from 'passport'
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

router.get('/get', passport.authenticate('jwt', { session: false }), (req: Request, res: Response, next: NextFunction) => {
  userController.getUser(req.user)
    .then(async (result) => {
      res.status(200).json(result)
    })
    .catch(async (error) => {
      next(error)
    })
})
export default router
