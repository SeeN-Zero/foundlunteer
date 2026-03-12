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
import { type JobStatus, type Prisma } from '@prisma/client'

function normalizeParam (value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function normalizeAuthorization (value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function handleControllerError (next: NextFunction, error: unknown): void {
  if (createHttpError.isHttpError(error)) {
    next(error)
    return
  }

  const message = error instanceof Error ? error.message : 'Internal Server Error'
  next(createHttpError(500, message))
}

interface JobBody {
  title: string
  description: string
  location: string
  jobStatus: JobStatus
  expiredAt: string | Date
}

interface UpdateJobBody {
  title?: string
  description?: string
  location?: string
  jobStatus?: string | JobStatus
  expiredAt?: string | Date
}

async function addJobController (req: Request<Record<string, string>, unknown, JobBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      await isOrganizationValidation(role)
      const job: Omit<Prisma.JobUncheckedCreateInput, 'organizationId'> = {
        ...req.body,
        expiredAt: new Date(req.body.expiredAt)
      }
      await addJobService(job, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getAllJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authorization = normalizeAuthorization(req.headers.authorization)
    if (authorization === undefined) {
      next(createHttpError(401, 'Authorization header is required'))
      return
    }
    const allJob = await getAllJobService(req.query, authorization)
    res.status(200).json(allJob)
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getJobByIdController (req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const jobId = normalizeParam(req.params.jobId)
    const authorization = normalizeAuthorization(req.headers.authorization)
    if (jobId === undefined) {
      next(createHttpError(400, 'Job Id is required'))
      return
    }
    if (authorization === undefined) {
      next(createHttpError(401, 'Authorization header is required'))
      return
    }
    const job = await getJobByIdService(jobId, authorization)
    res.status(200).json(job)
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function updateJobController (req: Request<Record<string, string>, unknown, UpdateJobBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      const jobId = normalizeParam(req.params.jobId)
      if (jobId === undefined) {
        next(createHttpError(400, 'Job Id is required'))
        return
      }
      await isOrganizationValidation(role)
      const updateData: Prisma.JobUncheckedUpdateInput = {}
      if (req.body.title !== undefined) {
        updateData.title = req.body.title
      }
      if (req.body.description !== undefined) {
        updateData.description = req.body.description
      }
      if (req.body.location !== undefined) {
        updateData.location = req.body.location
      }
      if (req.body.expiredAt !== undefined) {
        updateData.expiredAt = new Date(req.body.expiredAt)
      }
      if (req.body.jobStatus !== undefined) {
        updateData.jobStatus = req.body.jobStatus.toString().toUpperCase() as JobStatus
      }
      await updateJobService(jobId, updateData, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function deleteJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      const jobId = normalizeParam(req.params.jobId)
      if (jobId === undefined) {
        next(createHttpError(400, 'Job Id is required'))
        return
      }
      await isOrganizationValidation(role)
      await deleteJobService(jobId, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function updateJobStatusController (req: Request<Record<string, string>, unknown, { jobStatus: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role } = req.user
      const jobId = normalizeParam(req.params.jobId)
      if (jobId === undefined) {
        next(createHttpError(400, 'Job Id is required'))
        return
      }
      await isOrganizationValidation(role)
      await updateJobStatusService(jobId, req.body.jobStatus, organizationId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
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
