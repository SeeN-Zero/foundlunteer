import { type Organization, type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import { addOrganizationSchema, loginOrganizationSchema, updateOrganizationSchema } from './validation/organizationSchema'

import CommonService from '../services/commonService'
import OrganizationService from '../services/organizationService'

class OrganizationController {
  organizationService = new OrganizationService()
  commonService = new CommonService()

  async validateOrganization (organization: Organization): Promise<void> {
    try {
      await addOrganizationSchema.validateAsync(organization)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateLogin (login: { email: string, password: string }): Promise<void> {
    try {
      await loginOrganizationSchema.validateAsync(login)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateUpdate (body: { id: string }): Promise<void> {
    try {
      await updateOrganizationSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async addOrganization (organization: Organization): Promise<void> {
    try {
      await this.commonService.checkEmailAvailability(organization.email)
      await this.organizationService.addOrganization(organization)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async loginOrganization (login: { email: string, password: string }): Promise<{ token: string }> {
    try {
      const organization = await this.organizationService.getOrganizationByEmail(login.email)
      const token = await this.organizationService.loginOrganization(login.password, organization)
      return {
        token
      }
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async getOrganization (payload: any): Promise<any> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      return await this.organizationService.getOrganizationById(organizationId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
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

  async updateOrganization (organization: Organization, payload: any): Promise<void> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      organization.id = organizationId
      await this.organizationService.updateOrganization(organization)
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
