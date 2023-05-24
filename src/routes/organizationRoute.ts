import express, { type RequestHandler } from 'express'
import {
  getOrganizationJobController,
  updateOrganizationController,
  getJobDetailController, updateRegistrantStatusController
} from '../controllers/organizationController'
import { authentication } from '../middleware/authentication'
import { validateOrganizationUpdate, validateRegistrantUpdateStatus } from '../middleware/validation'

const router = express.Router()

router.get('/getjob', authentication, getOrganizationJobController as RequestHandler)
router.post('/update', authentication, validateOrganizationUpdate, updateOrganizationController as RequestHandler)
router.get('/jobdetail/:jobId', authentication, getJobDetailController as RequestHandler)
router.post('/updateregistrant', authentication, validateRegistrantUpdateStatus, updateRegistrantStatusController as RequestHandler)

export default router
