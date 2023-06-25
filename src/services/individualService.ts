import { JobStatus, Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  getIndividualById,
  updateIndividual,
  saveJob,
  deleteJob,
  checkSavedJob,
  getIndividualSavedJob,
  registerJob,
  getRegisteredJob,
  updateFileStatus,
  getIndividualFileStatus
} from '../repositories/individualRepository'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { type JobDto } from '../dto/jobDto'
import { type FileStatusDto, type RegisteredDto } from '../dto/userDto'
import { getJobById } from '../repositories/jobRepository'

async function isIndividualValidation (role: string): Promise<void> {
  if (role !== Role.INDIVIDUAL) {
    throw createHttpError(403, 'No Privilege')
  }
}

async function updateIndividualService (individualId: string, individual: any): Promise<void> {
  await updateIndividual(individualId, individual)
}

async function saveOrDeleteJobService (individualId: string, jobId: string): Promise<string> {
  const result = await checkSavedJob(individualId, jobId)
  if (result === 0) {
    await saveJob(individualId, jobId)
      .catch((error) => {
        if (error.code === 'P2025') {
          throw createHttpError(404, 'Job Not Found')
        } else {
          throw error
        }
      })
    return 'Saved'
  } else {
    await deleteJob(individualId, jobId)
      .catch((error) => {
        if (error.code === 'P2025') {
          throw createHttpError(404, 'Job Not Found')
        } else {
          throw error
        }
      })
    return 'Deleted'
  }
}

async function getIndividualSavedJobService (individualId: string): Promise<{ jobs: JobDto[] }> {
  return getIndividualSavedJob(individualId)
}

async function registerIndividualToJobService (individualId: string, jobId: string): Promise<void> {
  const job = await getJobById(jobId)
  if (job.jobStatus === JobStatus.OPEN) {
    const individual = await getIndividualById(individualId)
    const individualFile = await getIndividualFileStatus(individualId)
    delete individualFile.sertifikat
    const notNullData = Object.values(individual).every((property) => {
      return property !== null
    })
    const notNullFile = Object.values(individualFile).every((property) => {
      return property !== null
    })
    if (notNullData && notNullFile) {
      await registerJob(individualId, jobId)
        .catch((e) => {
          if (e.code === 'P2002') {
            throw createHttpError(400, 'Already registered')
          } else {
            throw e
          }
        })
    } else {
      throw createHttpError(400, 'Individual data must be complete before registering')
    }
  } else {
    throw createHttpError(400, 'Job Already CLOSE')
  }
}

async function getIndividualRegisteredJobService (individualId: string, token: string): Promise<{ registered: RegisteredDto[] }> {
  const registeredJob = await getRegisteredJob(individualId)
  const _dirname = dirname(fileURLToPath(import.meta.url))
  let filePathImage

  const allregisteredJob = registeredJob.registered.map(obj => {
    filePathImage = path.join(_dirname, '../storage/image', obj.job.organizationId + '.png')
    if (fs.existsSync(filePathImage)) {
      obj.job.image = 'https://aws.senna-annaba.my.id/user/getimageorg/' + obj.job.organizationId + '?token=' + encodeURI(token)
      return obj
    } else {
      obj.job.image = null
      return obj
    }
  })

  return { registered: allregisteredJob }
}

function updateStatusFileService (individualId: string): void {
  const _dirname = dirname(fileURLToPath(import.meta.url))
  let cv, ijazah, sertifikat
  const filePathCv = path.join(_dirname, '../storage/cv', individualId + '.pdf')
  const filePathIjazah = path.join(_dirname, '../storage/ijazah', individualId + '.pdf')
  const filePathSertifikat = path.join(_dirname, '../storage/sertifikat', individualId + '.pdf')
  if (fs.existsSync(filePathCv)) {
    cv = true
  } else {
    cv = null
  }
  if (fs.existsSync(filePathIjazah)) {
    ijazah = true
  } else {
    ijazah = null
  }
  if (fs.existsSync(filePathSertifikat)) {
    sertifikat = true
  } else {
    sertifikat = null
  }
  updateFileStatus(individualId, cv, ijazah, sertifikat)
    .catch((e) => {
      throw (e)
    })
}

async function getIndividualFileStatusService (individualId: string): Promise<FileStatusDto> {
  return await getIndividualFileStatus(individualId)
}

export {
  isIndividualValidation,
  updateIndividualService,
  saveOrDeleteJobService,
  getIndividualSavedJobService,
  registerIndividualToJobService,
  getIndividualRegisteredJobService,
  updateStatusFileService,
  getIndividualFileStatusService
}
