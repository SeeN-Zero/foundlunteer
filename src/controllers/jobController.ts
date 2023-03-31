import { type Job, type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import { addJobSchema, updateJobSchema } from './validation/jobSchema'
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

  async getAllJob (query: any): Promise<any> {
    try {
      const { page, limit, title } = query
      return await this.jobService.getAllJob(page, limit, title)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async updateJob (jobId: string, job: Job, payload: any): Promise<void> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      await this.jobService.updateJob(jobId, job, organizationId)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async deleteJob (jobId: string, payload: any): Promise<void> {
    try {
      const { id: organizationId, role }: { id: string, role: Role } = payload
      await this.organizationService.isOrganizationValidation(role)
      await this.jobService.deleteJob(jobId, organizationId)
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
