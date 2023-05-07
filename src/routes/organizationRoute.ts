import express, { type RequestHandler } from 'express'
import {
  getOrganizationJob,
  updateOrganization,
  getJobDetail
} from '../controllers/organizationController'
import { authentication } from '../middleware/authentication'
import { validateUpdate } from '../middleware/validation'

const router = express.Router()

router.get('/getjob', authentication, getOrganizationJob as RequestHandler)
router.post('/update', authentication, validateUpdate, updateOrganization as RequestHandler)
router.get('/jobdetail/:jobId', authentication, getJobDetail as RequestHandler)

export default router
