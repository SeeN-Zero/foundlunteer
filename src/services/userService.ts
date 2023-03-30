import IndividualRepository from '../repositories/individualRepository'
import OrganizationRepository from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import { type Individual, type Organization, Role } from '@prisma/client'
import IndividualService from './individualService'
import OrganizationService from './organizationService'

class UserService {
  individualRepository = new IndividualRepository()
  organizationRepository = new OrganizationRepository()
  individualService = new IndividualService()
  organizationService = new OrganizationService()

  async checkEmailAvailability (email: string): Promise<void> {
    const [individualResult, organizationResult] = await Promise.all([this.individualRepository.getIndividualByEmail(email),
      this.organizationRepository.getOrganizationByEmail(email)])
    if (individualResult !== null || organizationResult !== null) {
      throw createHttpError(400, 'Email Already In Use')
    }
  }

  async getOrganizationByEmail (email: string): Promise<Organization | null> {
    return await this.organizationRepository.getOrganizationByEmail(email)
  }

  async getIndividualByEmail (email: string): Promise<Individual | null> {
    return await this.individualRepository.getIndividualByEmail(email)
  }

  async loginUser (individual: any, organization: any, login: { email: string, password: string }): Promise<{ token: string }> {
    if (individual !== null) {
      const token = await this.individualService.loginIndividual(login.password, individual)
      return {
        token
      }
    } else if (organization !== null) {
      const token = await this.organizationService.loginOrganization(login.password, organization)
      return {
        token
      }
    } else {
      throw createHttpError(401, 'Incorrect Email Or Password')
    }
  }

  async getUser (id: string, role: Role): Promise<any> {
    if (role === Role.INDIVIDUAL) {
      const individual = await this.individualRepository.getIndividualById(id)
      const { registered, ...result } = individual
      return result
    } else {
      const organization = await this.organizationRepository.getOrganizationById(id)
      const { job, ...result } = organization
      return result
    }
  }
}

export default UserService
