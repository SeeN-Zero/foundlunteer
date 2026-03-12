import { type Prisma, type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  isOrganizationValidation,
  getOrganizationJobByIdService,
  updateOrganizationService,
  getJobDetailService, updateRegistrantStatusService
} from '../services/organizationService'
import { updateUserService } from '../services/userService'
import { type NextFunction, type Request, type Response } from 'express'

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

interface UpdateOrganizationBody {
  name?: string
  address?: string
  phone?: string
  leader?: string
  description?: string
  social?: string
}

interface UpdateRegistrantStatusBody {
  individualId: string
  jobId: string
  registrantStatus: string
}

async function getOrganizationJobController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await isOrganizationValidation(role)
      const organization = await getOrganizationJobByIdService(organizationId)
      res.status(200).json(organization)
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function updateOrganizationController (req: Request<Record<string, string>, unknown, UpdateOrganizationBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await isOrganizationValidation(role)
      const user: Prisma.UserUpdateInput = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      }
      const organization: Prisma.OrganizationUpdateInput = {
        leader: req.body.leader,
        description: req.body.description,
        social: req.body.social
      }
      await updateUserService(organizationId, user)
      await updateOrganizationService(organizationId, organization)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getJobDetailController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
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
      await isOrganizationValidation(role)
      const detail = await getJobDetailService(organizationId, jobId, authorization)
      res.status(200).json(detail)
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function updateRegistrantStatusController (req: Request<Record<string, string>, unknown, UpdateRegistrantStatusBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      const { individualId, jobId, registrantStatus } = req.body
      await isOrganizationValidation(role)
      await updateRegistrantStatusService(organizationId, jobId, individualId, registrantStatus)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

export {
  getOrganizationJobController,
  updateOrganizationController,
  getJobDetailController,
  updateRegistrantStatusController
}
