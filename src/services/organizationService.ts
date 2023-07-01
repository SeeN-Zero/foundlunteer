import { RegistrationStatus, Role } from '@prisma/client'
import {
  updateOrganization,
  getJob,
  getJobDetail, updateRegistrantStatus, getRegistrantStatus
} from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import { type JobDto, type JobRegistrantDto } from '../dto/jobDto'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

async function isOrganizationValidation (role: string): Promise<void> {
  if (role !== Role.ORGANIZATION) {
    throw createHttpError(403, 'No Privilege')
  }
}

async function getOrganizationJobByIdService (id: string): Promise<{ jobs: JobDto[] }> {
  const { job } = await getJob(id)
  return {
    jobs: job
  }
}

async function updateOrganizationService (id: string, organization: any): Promise<void> {
  await updateOrganization(id, organization)
}

async function getJobDetailService (organizationId: string, jobId: string, token: string): Promise<JobRegistrantDto> {
  const job = await getJobDetail(organizationId, jobId)
    .catch((error) => {
      if (error.code === 'P2025') {
        throw createHttpError(404, 'Job Not Found')
      } else {
        throw error
      }
    })
  const { registrant } = job
  const _dirname = dirname(fileURLToPath(import.meta.url))
  let filePathImage

  const registrantWithImage = registrant.map(obj => {
    if (obj.individual.id !== undefined) {
      filePathImage = path.join(_dirname, '../storage/image', obj.individual.id + '.png')
      if (fs.existsSync(filePathImage)) {
        return { ...obj, image: 'https://aws.senna-annaba.my.id/user/getimageuser/' + obj.individual.id + '?token=' + encodeURI(token) }
      } else {
        return { ...obj, image: null }
      }
    } else {
      return obj
    }
  })
  job.registrant = registrantWithImage
  return job
}

async function updateRegistrantStatusService (organizationId: string, jobId: string, individualId: string, regsitrantStatus: string): Promise<void> {
  const status = await getRegistrantStatus(organizationId, jobId, individualId)
  if (status[0].registrationStatus === RegistrationStatus.ONPROCESS) {
    await updateRegistrantStatus(organizationId, jobId, individualId, regsitrantStatus.toUpperCase() as RegistrationStatus)
      .catch((error) => {
        if (error.code === 'P2025') {
          throw createHttpError(404, 'Not Found')
        } else {
          throw error
        }
      })
  } else {
    throw createHttpError(400, 'Registrant not ONPROCESS status')
  }
}

export {
  isOrganizationValidation,
  getOrganizationJobByIdService,
  updateOrganizationService,
  getJobDetailService,
  updateRegistrantStatusService
}
