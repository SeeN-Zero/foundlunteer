import { Role } from '@prisma/client'
import OrganizationRepository from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import Jwt from './Configuration/jwt'

class OrganizationService {
  organizationRepository = new OrganizationRepository()
  jwt = new Jwt()

  async isOrganizationValidation (role: string): Promise<void> {
    if (role !== Role.ORGANIZATION) {
      throw createHttpError(403, 'No Privilege')
    }
  }

  async getOrganizationJobById (id: string): Promise<any> {
    return await this.organizationRepository.getJob(id)
  }

  // async addOrganization (organization: Organization): Promise<any> {
  //   organization.password = await this.passwordEncoder.encode(organization.password)
  //   await this.organizationRepository.addOrganization(organization)
  // }

  // async loginOrganization (loginPassword: string, organization: Organization): Promise<string> {
  //   await this.passwordEncoder.compare(loginPassword, organization.password)
  //   return await this.jwt.generateJwt(organization.id, Role.ORGANIZATION)
  // }

  async updateOrganization (id: string, organization: any): Promise<void> {
    await this.organizationRepository.updateOrganization(id, organization)
  }

  async getJobDetail (organizationId: string, jobId: string): Promise<any> {
    return await this.organizationRepository.getJobDetail(organizationId, jobId)
  }
}

export default OrganizationService
