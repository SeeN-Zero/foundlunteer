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
      return await this.individualRepository.getIndividualById(id)
    } else {
      return await this.organizationRepository.getOrganizationById(id)
    }
  }

  async updateUser (id: string, user: any): Promise<void> {
    await this.userRepository.updateUser(id, user)
  }

  async sendEmailForgotPassword (targetMail: string): Promise<void> {
    const code = Math.floor(Math.random() * 9000 + 1000)
    // Expire after 30 minutes
    const createdAt = new Date(Date.now()).toISOString()
    const expiredAt = new Date(Date.now() + 0.5 * (60 * 60 * 1000)).toISOString()
    await this.userRepository.createCode(targetMail, code, createdAt, expiredAt)
    await this.email.sendEmail(targetMail, { code }, 'email.html', 'Foundlunteer Forgot Password')
  }

  async changePassword (email: string, code: number, password: string): Promise<boolean> {
    const user = await this.userRepository.getCode(email)
    if (user !== null) {
      const currentDate = new Date(Date.now())
      if (code === user.code && currentDate < user.expireAt) {
        const newPassword = await this.passwordEncoder.encode(password)
        await this.userRepository.updatePassword(email, newPassword)
      } else {
        throw createHttpError(400, 'Code Invalid')
      }
    } else {
      throw createHttpError(404, 'Data Not Found')
    }
    return true
  }
}

export default UserService
