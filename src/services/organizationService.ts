import { RegistrationStatus, Role } from '@prisma/client'
import {
  updateOrganization,
  getJob,
  getJobDetail, updateRegistrantStatus, getRegistrantStatus
} from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import { type JobDto, type JobRegistrantDto } from '../dto/jobDto'

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

async function getJobDetailService (organizationId: string, jobId: string): Promise<JobRegistrantDto> {
  return getJobDetail(organizationId, jobId)
    .catch((error) => {
      if (error.code === 'P2025') {
        throw createHttpError(404, 'Job Not Found')
      } else {
        throw error
      }
    })
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
