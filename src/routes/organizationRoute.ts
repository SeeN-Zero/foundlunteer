import express, { type RequestHandler } from 'express'
import {
  getOrganizationJobController,
  updateOrganizationController,
  getJobDetailController
} from '../controllers/organizationController'
import { authentication } from '../middleware/authentication'
import { validateOrganizationUpdate } from '../middleware/validation'

const router = express.Router()

router.get('/getjob', authentication, getOrganizationJobController as RequestHandler)
router.post('/update', authentication, validateOrganizationUpdate, updateOrganizationController as RequestHandler)
router.get('/jobdetail/:jobId', authentication, getJobDetailController as RequestHandler)

export default router
