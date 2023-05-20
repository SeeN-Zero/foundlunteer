import createHttpError from 'http-errors'
import {
  isIndividualValidation,
  updateIndividualService,
  saveOrDeleteJobService,
  getIndividualSavedJobService,
  registerIndividualToJobService,
  getIndividualRegisteredJobService,
  updateStatusFileService
} from '../services/individualService'
import { updateUserService } from '../services/userService'
import { type NextFunction, type Request, type Response } from 'express'
import { uploadFile } from '../services/Configuration/multer'

async function updateIndividualController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      const user = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      }
      const individual = {
        age: req.body.age,
        description: req.body.description,
        social: req.body.social
      }
      await updateUserService(individualId, user)
      await updateIndividualService(individualId, individual)
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

async function saveOrDeleteJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      const result = await saveOrDeleteJobService(individualId, req.params.jobId)
      res.status(200).json({ message: result })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
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
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function registerIndividualJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      await registerIndividualToJobService(individualId, req.params.jobId)
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

async function getIndividualRegisteredJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: individualId, role } = req.user
      await isIndividualValidation(role)
      const result = await getIndividualRegisteredJobService(individualId)
      res.status(200).json(result)
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function uploadUserFileController (req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.user !== undefined) {
    const { id: individualId, role } = req.user
    await isIndividualValidation(role)
    uploadFile(req, res, function (error): void {
      if (error !== undefined) {
        next(error)
      }
      updateStatusFileService(individualId)
      res.status(200).json({ message: 'success' })
    })
  }
}

export {
  updateIndividualController,
  saveOrDeleteJobController,
  getIndividualRegisteredJobController,
  registerIndividualJobController,
  getIndividualSavedJobController,
  uploadUserFileController
}
