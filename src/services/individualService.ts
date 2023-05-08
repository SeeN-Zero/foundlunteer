import { Role } from '@prisma/client'
import createHttpError from 'http-errors'
import {
  getIndividualById,
  updateIndividual,
  saveJob,
  deleteJob,
  checkSavedJob,
  getIndividualSavedJob,
  registerJob,
  getRegisteredJob
} from '../repositories/individualRepository'

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
  if (result.length === 0) {
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

async function getIndividualSavedJobService (individualId: string): Promise<any> {
  const result = await getIndividualSavedJob(individualId)
    .catch((e) => {
      throw e
    })
  const { jobs } = result
  return { job: jobs }
}

async function registerIndividualToJobService (individualId: string, jobId: string): Promise<void> {
  const individual = await getIndividualById(individualId)
  const notNull = Object.values(individual).every((property) => {
    return property !== null
  })
  if (notNull) {
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
}

async function getIndividualRegisteredJobService (individualId: string): Promise<any> {
  return await getRegisteredJob(individualId)
}

export {
  isIndividualValidation,
  updateIndividualService,
  saveOrDeleteJobService,
  getIndividualSavedJobService,
  registerIndividualToJobService,
  getIndividualRegisteredJobService
}
