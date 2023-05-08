import { Role } from '@prisma/client'
import {
  updateOrganization,
  getJob,
  getJobDetail
} from '../repositories/organizationRepository'
import createHttpError from 'http-errors'

async function isOrganizationValidation (role: string): Promise<void> {
  if (role !== Role.ORGANIZATION) {
    throw createHttpError(403, 'No Privilege')
  }
}

async function getOrganizationJobByIdService (id: string): Promise<any> {
  return await getJob(id)
}

async function updateOrganizationService (id: string, organization: any): Promise<void> {
  await updateOrganization(id, organization)
}

async function getJobDetailService (organizationId: string, jobId: string): Promise<any> {
  return await getJobDetail(organizationId, jobId)
}

export {
  isOrganizationValidation,
  getOrganizationJobByIdService,
  updateOrganizationService,
  getJobDetailService
}
