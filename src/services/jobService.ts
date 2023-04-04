import { type Job } from '@prisma/client'
import JobRepository from '../repositories/jobRepository'
import createHttpError from 'http-errors'

class JobService {
  jobRepository = new JobRepository()
  async addJob (job: Job, organizationId: string): Promise<void> {
    job.organizationId = organizationId
    await this.jobRepository.addJob(job)
  }

  async getAllJob (page: string | undefined, limit: string | undefined, filter: string | undefined): Promise<any> {
    let skip: number | undefined
    let limitNum: number | undefined
    if (page !== undefined && limit === undefined) {
      throw createHttpError(400, 'Pages must be followed by a limit')
    } else if ((page === undefined || page === '1') && limit !== undefined) {
      limitNum = parseInt(limit)
      skip = 0
    } else if (page !== undefined && limit !== undefined) {
      limitNum = parseInt(limit)
      skip = (parseInt(page) - 1) * parseInt(limit)
    }
    const allJob = await this.jobRepository.getAllJob(limitNum, skip, filter)
    return {
      job: allJob
    }
  }

  async getJobById (jobId: string): Promise<any> {
    const job = await this.jobRepository.getJobById(jobId)
    if (job === null) {
      throw createHttpError(404, 'Job Not Found')
    } else {
      return job
    }
  }

  async updateJob (jobId: string, job: Job, organizationId: string): Promise<void> {
    job.id = jobId
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
