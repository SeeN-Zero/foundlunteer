import express, { type RequestHandler } from 'express'
import {
  updateIndividualController,
  saveOrDeleteJobController,
  getIndividualRegisteredJobController,
  registerIndividualJobController,
  getIndividualSavedJobController,
  uploadIndividualFileController,
  checkIndividualFileController
} from '../controllers/individualController'
import { authentication } from '../middleware/authentication'
import { validateIndividualUpdate } from '../middleware/validation'
const router = express.Router()

router.post('/update', authentication, validateIndividualUpdate, updateIndividualController as RequestHandler)
router.post('/saveordeletejob/:jobId', authentication, saveOrDeleteJobController as RequestHandler)
router.get('/savedjob', authentication, getIndividualSavedJobController as RequestHandler)
router.get('/registeredjob', authentication, getIndividualRegisteredJobController as RequestHandler)
router.post('/register/:jobId', authentication, registerIndividualJobController as RequestHandler)
router.post('/file', authentication, uploadIndividualFileController as RequestHandler)
router.get('/filestatus', authentication, checkIndividualFileController as RequestHandler)

export default router
