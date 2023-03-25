import IndividualRepository from '../repositories/individualRepository'
import OrganizationRepository from '../repositories/organizationRepository'
import createHttpError from 'http-errors'

class CommonService {
  individualRepository = new IndividualRepository()
  organizationRepository = new OrganizationRepository()

  async checkEmailAvailability (email: string): Promise<void> {
    const individualResult = await this.individualRepository.getIndividualByEmail(email)
    const organizationResult = await this.organizationRepository.getOrganizationByEmail(email)
    if (individualResult !== null || organizationResult !== null) {
      throw createHttpError(400, 'Email Already In Use')
    }
  }
}

export default CommonService
