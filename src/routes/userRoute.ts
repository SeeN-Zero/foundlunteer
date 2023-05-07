import express, { type RequestHandler } from 'express'
import {
  addUser, forgotPassword,
  getUser,
  getUserCv,
  getUserImage,
  loginUser,
  sendCode,
  uploadUserFile
} from '../controllers/userController'
import { authentication } from '../middleware/authentication'
import { validateForgotPassword, validateLogin, validateUser } from '../middleware/validation'

const router = express.Router()

router.post('/add', validateUser, addUser as RequestHandler)
router.post('/login', validateLogin, loginUser as RequestHandler)
router.get('/get', authentication, getUser as RequestHandler)
router.post('/file', authentication, uploadUserFile as RequestHandler)
router.get('/getimage/:userId?', authentication, getUserImage as RequestHandler)
router.get('/getcv/:userId?', authentication, getUserCv as RequestHandler)
router.post('/sendcode', sendCode as RequestHandler)
router.post('/forgotpassword', validateForgotPassword, forgotPassword as RequestHandler)
export default router
