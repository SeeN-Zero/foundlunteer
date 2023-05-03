import IndividualRepository from '../repositories/individualRepository'
import OrganizationRepository from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import { Role, type User } from '@prisma/client'
import Email from './Configuration/email'
import PasswordEncoder from './Configuration/passwordEncoder'
import UserRepository from '../repositories/userRepository'
import Jwt from './Configuration/jwt'

class UserService {
  userRepository = new UserRepository()
  individualRepository = new IndividualRepository()
  organizationRepository = new OrganizationRepository()
  passwordEncoder = new PasswordEncoder()
  email = new Email()
  jwt = new Jwt()

  async addUser (user: User): Promise<void> {
    user.password = await this.passwordEncoder.encode(user.password)
    if (user.role === Role.INDIVIDUAL) {
      await this.individualRepository.addIndividual(user)
        .catch((error) => {
          if (error.code === 'P2002') {
            throw createHttpError(400, 'Email Already In Use')
          } else {
            throw error
          }
        })
    } else {
      await this.organizationRepository.addOrganization(user)
        .catch((error) => {
          if (error.code === 'P2002') {
            throw createHttpError(400, 'Email Already In Use')
          } else {
            throw error
          }
        })
    }
  }

  async loginUser (user: User, login: { email: string, password: string }): Promise<{ token: string }> {
    if (user !== null) {
      await this.passwordEncoder.compare(login.password, user.password)
      const token = await this.jwt.generateJwt(user.id, user.role)
      return {
        token
      }
    } else {
      throw createHttpError(401, 'Incorrect Email Or Password')
    }
  }

  async getUserByEmail (email: string): Promise<any> {
    return await this.userRepository.getUserByEmail(email)
  }

  async getUser (id: string, role: Role): Promise<any> {
    if (role === Role.INDIVIDUAL) {
      const user = await this.userRepository.getUser(id)
      const individual = await this.individualRepository.getIndividualById(id)
      const { registered, ...result } = individual
      return { ...user, ...result }
    } else {
      const user = await this.userRepository.getUser(id)
      const organization = await this.organizationRepository.getOrganizationById(id)
      const { job, ...result } = organization
      return { ...user, ...result }
    }
  }

  async updateUser (id: string, user: any): Promise<void> {
    await this.userRepository.updateUser(id, user)
  }

  async sendEmailForgotPassword (targetMail: string, code: number): Promise<void> {
    await this.email.sendEmail(targetMail, { code }, 'email.html', 'Foundlunteer Forgot Password')
  }
}

export default UserService
