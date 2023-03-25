import { type Individual, type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  addIndividualSchema,
  loginIndividualSchema,
  saveJobIndividualSchema,
  updateIndividualSchema
} from './validation/individualSchema'
import CommonService from '../services/commonService'
import IndividualService from '../services/individualService'

class individualController {
  individualService = new IndividualService()
  commonService = new CommonService()

  async validateIndividual (individual: Individual): Promise<void> {
    try {
      await addIndividualSchema.validateAsync(individual)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateLogin (login: { email: string, password: string }): Promise<void> {
    try {
      await loginIndividualSchema.validateAsync(login)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateUpdate (body: { id: string }): Promise<void> {
    try {
      await updateIndividualSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateSaveJob (body: { id: string }): Promise<void> {
    try {
      await saveJobIndividualSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async addIndividual (individual: Individual): Promise<void> {
    try {
      await this.commonService.checkEmailAvailability(individual.email)
      await this.individualService.addIndividual(individual)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async loginIndividual (login: { email: string, password: string }): Promise<{ token: string }> {
    try {
      const individual = await this.individualService.getIndividualByEmail(login.email)
      const token = await this.individualService.loginIndividual(login.password, individual)
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

  async getIndividual (payload: any): Promise<any> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      return await this.individualService.getIndividualById(individualId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async updateIndividual (individual: Individual, payload: any): Promise<void> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      individual.id = individualId
      await this.individualService.updateIndividual(individual)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async saveJob (jobId: string, payload: any): Promise<string> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      return await this.individualService.saveOrDeleteJob(individualId, jobId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }
}

export default individualController
