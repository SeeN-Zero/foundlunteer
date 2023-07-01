import express, { type RequestHandler } from 'express'
import {
  addUserController,
  loginUserController,
  getUserController,
  uploadUserImageController,
  getUserImageController,
  getUserCvController,
  sendCodeController,
  forgotPasswordController,
  changePasswordController,
  getUserIjazahController,
  getUserSertifikatController,
  getUserImageUserController
} from '../controllers/userController'
import { authentication, validateJwt } from '../middleware/authentication'
import { validateChangePassword, validateForgotPassword, validateLogin, validateUser } from '../middleware/validation'

const router = express.Router()

router.post('/add', validateUser, addUserController as RequestHandler)
router.post('/login', validateLogin, loginUserController as RequestHandler)
router.get('/get', authentication, getUserController as RequestHandler)
router.post('/image', authentication, uploadUserImageController as RequestHandler)
router.get('/getimage/:userId?', authentication, getUserImageController as RequestHandler)
router.get('/getimageuser/:userId?', validateJwt, getUserImageUserController as RequestHandler)
router.get('/getcv/:userId?', authentication, getUserCvController as RequestHandler)
router.get('/getijazah/:userId?', authentication, getUserIjazahController as RequestHandler)
router.get('/getsertifikat/:userId?', authentication, getUserSertifikatController as RequestHandler)
router.post('/changepassword', authentication, validateChangePassword, changePasswordController as RequestHandler)
router.post('/sendcode', sendCodeController as RequestHandler)
router.post('/forgotpassword', validateForgotPassword, forgotPasswordController as RequestHandler)

export default router
