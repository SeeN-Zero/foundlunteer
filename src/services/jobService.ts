import { type Job, type JobStatus } from '@prisma/client'
import { addJob, deleteJob, getAllJob, getJobById, updateJob, updateJobStatus } from '../repositories/jobRepository'
import createHttpError from 'http-errors'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

async function addJobService (job: Job, organizationId: string): Promise<void> {
  job.organizationId = organizationId
  await addJob(job)
}

async function getAllJobService (query: any, token: string): Promise<any> {
  const { page, limit, title, location, organization } = query
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
  const allJob = await getAllJob(limitNum, skip, title, location, organization)
  const _dirname = dirname(fileURLToPath(import.meta.url))
  let filePathImage

  const allJobFinal = allJob.map(obj => {
    filePathImage = path.join(_dirname, '../storage/image', obj.organizationId + '.png')
    if (fs.existsSync(filePathImage)) {
      return { ...obj, image: 'https://aws.senna-annaba.my.id/user/getimageuser/' + obj.organizationId + '?token=' + encodeURI(token) }
    } else {
      return { ...obj, image: null }
    }
  })
  return {
    jobs: allJobFinal
  }
}

async function getJobByIdService (jobId: string, token: string): Promise<any> {
  const allJob = await getJobById(jobId).catch((error) => {
    if (error.code === 'P2025') {
      throw createHttpError(404, 'Job Not Found')
    } else {
      throw error
    }
  })
  return {
    ...allJob,
    image: 'https://aws.senna-annaba.my.id/user/getimageuser/' + allJob.organizationId + '?token=' + encodeURI(token)
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

async function deleteJobService (jobId: string, organizationId: string): Promise <void> {
  const totalDelete = await deleteJob(jobId, organizationId)
  if (totalDelete.count === 0
  ) {
    throw createHttpError(404, 'Data Not Found')
  }
}

async function updateJobStatusService (jobId: string, jobStatus: string, organizationId: string): Promise<void> {
  const totalUpdate = await updateJobStatus(jobId, organizationId, jobStatus.toUpperCase() as JobStatus)
  if (totalUpdate.count === 0) {
    throw createHttpError(404, 'Data Not Found')
  }
}

export {
  addJobService,
  getJobByIdService,
  getAllJobService,
  updateJobService,
  deleteJobService,
  updateJobStatusService
}
