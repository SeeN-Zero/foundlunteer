import createHttpError from 'http-errors'
import {
  isIndividualValidation,
  updateIndividualService,
  saveOrDeleteJobService,
  getIndividualSavedJobService,
  registerIndividualToJobService,
  getIndividualRegisteredJobService,
  updateStatusFileService,
  getIndividualFileStatusService
} from '../services/individualService'
import { updateUserService } from '../services/userService'
import { type NextFunction, type Request, type Response } from 'express'
import { uploadFile } from '../services/Configuration/multer'
import { type Prisma } from '@prisma/client'

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

interface UpdateIndividualBody {
  name?: string
  address?: string
  phone?: string
  birthOfDate?: string
  description?: string
  social?: string
}

async function updateIndividualController (req: Request<Record<string, string>, unknown, UpdateIndividualBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      const user: Prisma.UserUpdateInput = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      }
      const individual: Prisma.IndividualUpdateInput = {
        birthOfDate: req.body.birthOfDate !== undefined ? new Date(req.body.birthOfDate) : undefined,
        description: req.body.description,
        social: req.body.social
      }
      await updateUserService(individualId, user)
      await updateIndividualService(individualId, individual)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function saveOrDeleteJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      const jobId = normalizeParam(req.params.jobId)
      if (jobId === undefined) {
        next(createHttpError(400, 'Job Id is required'))
        return
      }
      await isIndividualValidation(role)
      const result = await saveOrDeleteJobService(individualId, jobId)
      res.status(200).json({ message: result })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getIndividualSavedJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      const result = await getIndividualSavedJobService(individualId)
      res.status(200).json(result)
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function registerIndividualJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      const jobId = normalizeParam(req.params.jobId)
      if (jobId === undefined) {
        next(createHttpError(400, 'Job Id is required'))
        return
      }
      await isIndividualValidation(role)
      await registerIndividualToJobService(individualId, jobId)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getIndividualRegisteredJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      const authorization = normalizeAuthorization(req.headers.authorization)
      if (authorization === undefined) {
        next(createHttpError(401, 'Authorization header is required'))
        return
      }
      await isIndividualValidation(role)
      const result = await getIndividualRegisteredJobService(individualId, authorization)
      res.status(200).json(result)
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function uploadIndividualFileController (req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.user !== undefined) {
    const { id: individualId, role } = req.user
    await isIndividualValidation(role)
    uploadFile(req, res, function (error: unknown): void {
      if (error !== undefined) {
        if (error instanceof Error && 'code' in error && error.code === 'LIMIT_FILE_SIZE') {
          next(createHttpError(400, error.message))
        } else {
          handleControllerError(next, error)
        }
      } else {
        updateStatusFileService(individualId)
          .then(() => {
            res.status(200).json({ message: 'success' })
          })
          .catch((error: unknown) => {
            handleControllerError(next, error)
          })
      }
    })
  }
}

async function checkIndividualFileController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      const result = await getIndividualFileStatusService(individualId)
      res.status(200).json(result)
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

export {
  updateIndividualController,
  saveOrDeleteJobController,
  getIndividualRegisteredJobController,
  registerIndividualJobController,
  getIndividualSavedJobController,
  uploadIndividualFileController,
  checkIndividualFileController
}
