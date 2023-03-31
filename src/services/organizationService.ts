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

  async getOrganizationJobById (id: string): Promise<any> {
    const organization = await this.organizationRepository.getOrganizationById(id)
    const { job } = organization
    return {
      job
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

  async getJobDetail (organizationId: string, jobId: string): Promise<any> {
    return await this.organizationRepository.getJobDetail(organizationId, jobId)
  }
}

export default OrganizationService
