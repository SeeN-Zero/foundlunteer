import { type Organization, Role } from '@prisma/client'
import PasswordEncoder from './passwordEncoder'
import OrganizationRepository from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import Jwt from './jwt'

class OrganizationService {
  passwordEncoder = new PasswordEncoder()
  organizationRepository = new OrganizationRepository()
  jwt = new Jwt()

  async isOrganizationValidation (role: string): Promise<void> {
    if (role !== Role.ORGANIZATION) {
      throw createHttpError(403, 'No Privilege')
    }
  }

  async getOrganizationById (id: string): Promise<any> {
    const organization = await this.organizationRepository.getOrganizationById(id)
    const { job, ...result } = organization
    return result
  }

  async getOrganizationJobById (id: string): Promise<any> {
    const organization = await this.organizationRepository.getOrganizationById(id)
    const { job } = organization
    return {
      job
    }
  }

  async getOrganizationByEmail (email: string): Promise<Organization> {
    const organization = await this.organizationRepository.getOrganizationByEmail(email)
    if (organization !== null) {
      return organization
    } else {
      throw createHttpError(401, 'Incorrect Email Or Password')
    }
  }

  async addOrganization (organization: Organization): Promise<any> {
    organization.password = await this.passwordEncoder.encode(organization.password)
    await this.organizationRepository.addOrganization(organization)
  }

  async loginOrganization (loginPassword: string, organization: Organization): Promise<string> {
    await this.passwordEncoder.compare(loginPassword, organization.password)
    return await this.jwt.generateJwt(organization.id, Role.ORGANIZATION)
  }

  async updateOrganization (organization: Organization): Promise<void> {
    await this.organizationRepository.updateOrganization(organization)
  }
}

export default OrganizationService
