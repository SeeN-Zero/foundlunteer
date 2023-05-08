import { type Job } from '@prisma/client'
import { addJob, deleteJob, getAllJob, getJobById, updateJob } from '../repositories/jobRepository'
import createHttpError from 'http-errors'

async function addJobService (job: Job, organizationId: string): Promise<void> {
  job.organizationId = organizationId
  await addJob(job)
}

async function getAllJobService (query: any): Promise<any> {
  const { page, limit, filter } = query
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
  const allJob = await getAllJob(limitNum, skip, filter)
  return {
    job: allJob
  }
}

async function getJobByIdService (jobId: string): Promise<any> {
  const job = await getJobById(jobId)
  if (job === null) {
    throw createHttpError(404, 'Job Not Found')
  } else {
    return job
  }
}

async function updateJobService (jobId: string, job: Job, organizationId: string): Promise<void> {
  job.id = jobId
  job.organizationId = organizationId
  const totalUpdate = await updateJob(job)
  if (totalUpdate.count === 0) {
    throw createHttpError(404, 'Data Not Found')
  }
}

async function deleteJobService (jobId: string, organizationId: string): Promise < void > {
  const totalDelete = await deleteJob(jobId, organizationId)
  if (totalDelete.count === 0
  ) {
    throw createHttpError(404, 'Data Not Found')
  }
}

export {
  addJobService,
  getJobByIdService,
  getAllJobService,
  updateJobService,
  deleteJobService
}
