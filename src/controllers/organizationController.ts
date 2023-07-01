import { type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  isOrganizationValidation,
  getOrganizationJobByIdService,
  updateOrganizationService,
  getJobDetailService, updateRegistrantStatusService
} from '../services/organizationService'
import { updateUserService } from '../services/userService'
import { type NextFunction, type Request, type Response } from 'express'

async function getOrganizationJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await isOrganizationValidation(role)
      const organization = await getOrganizationJobByIdService(organizationId)
      res.status(200).json(organization)
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function updateOrganizationController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await isOrganizationValidation(role)
      const user = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      }
      const organization = {
        leader: req.body.leader,
        description: req.body.description,
        social: req.body.social
      }
      await updateUserService(organizationId, user)
      await updateOrganizationService(organizationId, organization)
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

async function getJobDetailController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await isOrganizationValidation(role)
      const detail = await getJobDetailService(organizationId, req.params.jobId, req.headers.authorization as string)
      res.status(200).json(detail)
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function updateRegistrantStatusController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      const { individualId, jobId, registrantStatus } = req.body
      await isOrganizationValidation(role)
      await updateRegistrantStatusService(organizationId, jobId, individualId, registrantStatus)
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
  getOrganizationJobController,
  updateOrganizationController,
  getJobDetailController,
  updateRegistrantStatusController
}
