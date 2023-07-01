import createHttpError from 'http-errors'
import { isOrganizationValidation } from '../services/organizationService'
import {
  addJobService,
  getJobByIdService,
  getAllJobService,
  updateJobService,
  deleteJobService, updateJobStatusService
} from '../services/jobService'
import { type NextFunction, type Request, type Response } from 'express'

async function addJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      await isOrganizationValidation(role)
      req.body.expiredAt = new Date(req.body.expiredAt)
      await addJobService(req.body, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function getAllJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const allJob = await getAllJobService(req.query, req.headers.authorization as string)
    res.status(200).json(allJob)
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function getJobByIdController (req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { jobId } = req.params
    const job = await getJobByIdService(jobId, req.headers.authorization as string)
    res.status(200).json(job)
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function updateJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      await isOrganizationValidation(role)
      req.body.expiredAt = new Date(req.body.expiredAt)
      await updateJobService(req.params.jobId, req.body, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function deleteJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      await isOrganizationValidation(role)
      await deleteJobService(req.params.jobId, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function updateJobStatusController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      await isOrganizationValidation(role)
      await updateJobStatusService(req.params.jobId, req.body.jobStatus, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

export {
  addJobController,
  getAllJobController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  updateJobStatusController
}
