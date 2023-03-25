import { type Individual, Role } from '@prisma/client'
import createHttpError from 'http-errors'
import IndividualRepository from '../repositories/individualRepository'
import PasswordEncoder from './passwordEncoder'
import Jwt from './jwt'
class IndividualService {
  individualRepository = new IndividualRepository()
  passwordEncoder = new PasswordEncoder()
  jwt = new Jwt()
  async isIndividualValidation (role: string): Promise<void> {
    if (role !== Role.INDIVIDUAL) {
      throw createHttpError(403, 'No Privilege')
    }
  }

  async getIndividualById (id: string): Promise<Individual> {
    return await this.individualRepository.getIndividualById(id)
  }

  async getIndividualByEmail (email: string): Promise<Individual> {
    const individual = await this.individualRepository.getIndividualByEmail(email)
    if (individual !== null) {
      return individual
    } else {
      throw createHttpError(401, 'Incorrect Email Or Password')
    }
  }

  async addIndividual (individual: Individual): Promise<void> {
    individual.password = await this.passwordEncoder.encode(individual.password)
    await this.individualRepository.addIndividual(individual)
  }

  async loginIndividual (loginPassword: string, individual: Individual): Promise<string> {
    await this.passwordEncoder.compare(loginPassword, individual.password)
    return await this.jwt.generateJwt(individual.id, Role.INDIVIDUAL)
  }

  async updateIndividual (individual: Individual): Promise<void> {
    await this.individualRepository.updateIndividual(individual)
  }

  async saveOrDeleteJob (individualId: string, jobId: string): Promise<string> {
    const result = await this.individualRepository.checkSavedJob(individualId, jobId)
    if (result.length === 0) {
      await this.individualRepository.saveJob(individualId, jobId)
        .catch((error) => {
          if (error.code === 'P2025') {
            throw createHttpError(404, 'Job Not Found')
          } else {
            throw error
          }
        })
      return 'Saved'
    } else {
      await this.individualRepository.deleteJob(individualId, jobId)
        .catch((error) => {
          if (error.code === 'P2025') {
            throw createHttpError(404, 'Job Not Found')
          } else {
            throw error
          }
        })
      return 'deleted'
    }
  }

  async getIndividualSavedJob (individualId: string): Promise<any> {
    await this.individualRepository.getIndividualSavedJob(individualId)
      .catch((e) => {
        throw e
      })
  }
}

export default IndividualService
