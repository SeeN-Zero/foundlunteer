import { type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  updateIndividualSchema
} from '../middleware/validation/individualSchema'
import IndividualService from '../services/individualService'
import UserService from '../services/userService'

class individualController {
  individualService = new IndividualService()
  userService = new UserService()

  async validateUpdate (body: { id: string }): Promise<void> {
    try {
      await updateIndividualSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async updateIndividual (body: any, payload: any): Promise<void> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      const user = {
        name: body.name,
        address: body.address,
        phone: body.phone
      }
      const individual = {
        age: body.age,
        description: body.description,
        social: body.social
      }
      await this.userService.updateUser(individualId, user)
      await this.individualService.updateIndividual(individualId, individual)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async saveOrDeleteJob (jobId: string, payload: any): Promise<string> {
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

  async getIndividualSavedJob (payload: any): Promise<any> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      return await this.individualService.getIndividualSavedJob(individualId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async registerIndividualJob (payload: any, jobId: string): Promise<void> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      await this.individualService.registerIndividualToJob(individualId, jobId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async getIndividualRegisteredJob (payload: any): Promise<any> {
    try {
      const { id: individualId, role }: { id: string, role: Role } = payload
      await this.individualService.isIndividualValidation(role)
      return await this.individualService.getIndividualRegisteredJob(individualId)
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
