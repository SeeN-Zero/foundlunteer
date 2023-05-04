import { type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  updateOrganizationSchema
} from './validation/organizationSchema'
import OrganizationService from '../services/organizationService'
import UserService from '../services/userService'

class OrganizationController {
  organizationService = new OrganizationService()
  userService = new UserService()

  async validateUpdate (body: any): Promise<void> {
    try {
      await updateOrganizationSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async getOrganizationJob (payload: any): Promise<any> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      return await this.organizationService.getOrganizationJobById(organizationId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async updateOrganization (body: any, payload: any): Promise<void> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      const user = {
        name: body.name,
        address: body.address,
        phone: body.phone
      }
      const organization = {
        leader: body.leader,
        description: body.description
      }
      await this.userService.updateUser(organizationId, user)
      await this.organizationService.updateOrganization(organizationId, organization)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async getJobDetail (jobId: string, payload: any): Promise<any> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      const detail = await this.organizationService.getJobDetail(organizationId, jobId)
      return detail[0]
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }
}

export default OrganizationController
