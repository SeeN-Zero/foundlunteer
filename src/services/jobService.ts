import { type JobStatus, type Prisma } from '@prisma/client'
import { addJob, deleteJob, getAllJob, getJobById, updateJob, updateJobStatus } from '../repositories/jobRepository'
import createHttpError from 'http-errors'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { type JobDto } from '../dto/jobDto'

interface JobListQuery {
  page?: string
  limit?: string
  title?: string
  location?: string
  organization?: string
}

async function addJobService (job: Omit<Prisma.JobUncheckedCreateInput, 'organizationId'>, organizationId: string): Promise<void> {
  await addJob({
    ...job,
    organizationId
  })
}

async function getAllJobService (query: JobListQuery, token: string): Promise<{ jobs: Array<JobDto & { image: string | null }> }> {
  const hostUrl = process.env.HOST_URL
  if (hostUrl === undefined) {
    throw createHttpError(500, 'HOST_URL is not configured')
  }

  const { page, limit, title, location, organization } = query
  let skip: number | undefined
  let limitNum: number | undefined

  if (page !== undefined && limit === undefined) {
    throw createHttpError(400, 'Pages must be followed by a limit')
  }

  if (page !== undefined && (isNaN(Number(page)) || Number(page) < 1)) {
    throw createHttpError(400, 'Page must be a positive number')
  }

  if (limit !== undefined && (isNaN(Number(limit)) || Number(limit) < 1)) {
    throw createHttpError(400, 'Limit must be a positive number')
  }

  if ((page === undefined || page === '1') && limit !== undefined) {
    limitNum = Number(limit)
    skip = 0
  } else if (page !== undefined && limit !== undefined) {
    limitNum = Number(limit)
    skip = (Number(page) - 1) * Number(limit)
  }
  const allJob = await getAllJob(limitNum, skip, title, location, organization)
  const _dirname = dirname(fileURLToPath(import.meta.url))
  let filePathImage

  const allJobFinal = allJob.map(obj => {
    filePathImage = path.join(_dirname, '../storage/image', obj.organizationId + '.png')
    if (fs.existsSync(filePathImage)) {
      return { ...obj, image: hostUrl + '/user/getimageuser/' + obj.organizationId + '?token=' + encodeURI(token) }
    } else {
      return { ...obj, image: null }
    }
  })
  return {
    jobs: allJobFinal
  }
}

async function getJobByIdService (jobId: string, token: string): Promise<JobDto & { image: string | null }> {
  const hostUrl = process.env.HOST_URL
  if (hostUrl === undefined) {
    throw createHttpError(500, 'HOST_URL is not configured')
  }

  const allJob = await getJobById(jobId).catch((error) => {
    if (error.code === 'P2025') {
      throw createHttpError(404, 'Job Not Found')
    } else {
      throw error
    }
  })
  const _dirname = dirname(fileURLToPath(import.meta.url))
  const filePathImage = path.join(_dirname, '../storage/image', allJob.organizationId + '.png')

  return {
    ...allJob,
    image: fs.existsSync(filePathImage)
      ? hostUrl + '/user/getimageuser/' + allJob.organizationId + '?token=' + encodeURI(token)
      : null
  }
}

async function updateJobService (jobId: string, job: Prisma.JobUncheckedUpdateInput, organizationId: string): Promise<void> {
  const totalUpdate = await updateJob(jobId, organizationId, job)
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
