import { type Job } from '@prisma/client'
import JobRepository from '../repositories/jobRepository'
import createHttpError from 'http-errors'

class JobService {
  jobRepository = new JobRepository()
  async addJob (job: Job, organizationId: string): Promise<void> {
    job.organizationId = organizationId
    await this.jobRepository.addJob(job)
  }

  async getAllJob (): Promise<any> {
    const allJob = await this.jobRepository.getAllJob()
    return {
      job: allJob
    }
  }

  async updateJob (job: Job, organizationId: string): Promise<void> {
    job.organizationId = organizationId
    const totalUpdate = await this.jobRepository.updateJob(job)
    if (totalUpdate.count === 0) {
      throw createHttpError(404, 'Data Not Found')
    }
  }

  async deleteJob (jobId: string, organizationId: string): Promise<void> {
    const totalDelete = await this.jobRepository.deleteJob(jobId, organizationId)
    if (totalDelete.count === 0) {
      throw createHttpError(404)
    }
  }
}

export default JobService
