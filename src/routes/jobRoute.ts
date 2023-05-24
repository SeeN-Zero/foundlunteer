import express, { type RequestHandler } from 'express'
import { authentication } from '../middleware/authentication'
import { validateJob, validateJobUpdate, validateJobUpdateStatus } from '../middleware/validation'
import {
  addJobController,
  getAllJobController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  updateJobStatusController
} from '../controllers/jobController'
const router = express.Router()

router.post('/add', authentication, validateJob, addJobController as RequestHandler)
router.get('/getAll', authentication, getAllJobController as RequestHandler)
router.get('/get/:jobId', authentication, getJobByIdController as RequestHandler)
router.post('/update/:jobId', authentication, validateJobUpdate, updateJobController as RequestHandler)
router.post('/updatestatus/:jobId', authentication, validateJobUpdateStatus, updateJobStatusController as RequestHandler)
router.post('/delete/:jobId', authentication, deleteJobController as RequestHandler)

export default router
