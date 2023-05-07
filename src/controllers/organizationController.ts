import { type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import OrganizationService from '../services/organizationService'
import UserService from '../services/userService'
import { type NextFunction, type Request, type Response } from 'express'

const organizationService = new OrganizationService()
const userService = new UserService()

async function getOrganizationJob (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await organizationService.isOrganizationValidation(role)
      const organization = await organizationService.getOrganizationJobById(organizationId)
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

async function updateOrganization (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await organizationService.isOrganizationValidation(role)
      const user = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      }
      const organization = {
        leader: req.body.leader,
        description: req.body.description
      }
      await userService.updateUser(organizationId, user)
      await organizationService.updateOrganization(organizationId, organization)
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

async function getJobDetail (req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    if (req.user !== undefined) {
      const { id: organizationId, role }: { id: string, role: Role } = req.user
      await organizationService.isOrganizationValidation(role)
      const detail = await organizationService.getJobDetail(organizationId, req.params.jobId)
      res.status(200).json(detail[0])
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

export { getOrganizationJob, updateOrganization, getJobDetail }
