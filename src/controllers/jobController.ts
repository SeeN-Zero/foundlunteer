import { type Job, type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import { addJobSchema, deleteJobSchema, updateJobSchema } from './validation/jobSchema'
import OrganizationService from '../services/organizationService'
import JobService from '../services/jobService'

class JobController {
  organizationService = new OrganizationService()
  jobService = new JobService()

  async validateJob (job: { name: string, description: string }): Promise<void> {
    try {
      await addJobSchema.validateAsync(job)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateDelete (body: { id: string }): Promise<void> {
    try {
      await deleteJobSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateUpdate (body: { id: string }): Promise<void> {
    try {
      await updateJobSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async addJob (job: Job, payload: any): Promise<void> {
    try {
      const { id: organizationId, role } = payload
      await this.organizationService.isOrganizationValidation(role)
      await this.jobService.addJob(job, organizationId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async getAllJob (): Promise<any> {
    try {
      return await this.jobService.getAllJob()
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async updateJob (job: Job, payload: any): Promise<void> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      await this.jobService.updateJob(job, organizationId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async deleteJob (body: { id: string }, payload: any): Promise<void> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      await this.jobService.deleteJob(body.id, organizationId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }
}
export default JobController
