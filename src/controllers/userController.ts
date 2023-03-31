import { type Individual, Role } from '@prisma/client'
import createHttpError from 'http-errors'
import IndividualService from '../services/individualService'
import UserService from '../services/userService'
import OrganizationService from '../services/organizationService'
import { addUserSchema, loginUserSchema } from './validation/userSchema'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

class UserController {
  individualService = new IndividualService()
  organizationService = new OrganizationService()
  userService = new UserService()

  async validateUser (individual: Individual): Promise<void> {
    try {
      await addUserSchema.validateAsync(individual)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateLogin (login: { email: string, password: string }): Promise<void> {
    try {
      await loginUserSchema.validateAsync(login)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  // TODO : Add Email Send For Account Activation
  async addUser (body: any): Promise<void> {
    try {
      await this.userService.checkEmailAvailability(body.email)
      body.role = body.role.toUpperCase()
      if (body.role === Role.INDIVIDUAL) {
        await this.individualService.addIndividual(body)
      } else {
        await this.organizationService.addOrganization(body)
      }
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  // TODO : Add Barrier For Email Activation
  async loginUser (login: { email: string, password: string }): Promise<{ token: string }> {
    try {
      const [individual, organization] = await Promise.all([this.userService.getIndividualByEmail(login.email),
        this.userService.getOrganizationByEmail(login.email)])
      return await this.userService.loginUser(individual, organization, login)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async getUser (payload: any): Promise<any> {
    try {
      const { id, role }: { id: string, role: Role } = payload
      return await this.userService.getUser(id, role)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async getUserImage (payload: any): Promise<string> {
    const { id }: { id: string } = payload
    const filename = fileURLToPath(import.meta.url)
    const _dirname = dirname(filename)
    return path.join(_dirname, '../image', id + '.png')
  }
}

export default UserController
