import { type Role } from '@prisma/client'
import createHttpError from 'http-errors'
import UserService from '../services/userService'
import { addUserSchema, forgotPasswordSchema, loginUserSchema } from './validation/userSchema'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

class UserController {
  userService = new UserService()

  async validateUser (body: any): Promise<void> {
    try {
      await addUserSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateLogin (body: any): Promise<void> {
    try {
      await loginUserSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  async validateForgotPassword (body: any): Promise<void> {
    try {
      await forgotPasswordSchema.validateAsync(body)
    } catch (error: any) {
      throw createHttpError(400, error.message)
    }
  }

  // TODO : Add Email Send For Account Activation
  async addUser (body: any): Promise<void> {
    try {
      body.role = body.role.toUpperCase()
      await this.userService.addUser(body)
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
      // const [individual, organization] = await Promise.all([this.userService.getIndividualByEmail(login.email),
      //   this.userService.getOrganizationByEmail(login.email)])
      const user = await this.userService.getUserByEmail(login.email)
      return await this.userService.loginUser(user, login)
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
    const _dirname = dirname(fileURLToPath(import.meta.url))
    return path.join(_dirname, '../image', id + '.png')
  }

  async sendCode (body: any): Promise<void> {
    try {
      const { email } = body
      const user = await this.userService.getUserByEmail(email)
      if (user !== null) {
        await this.userService.sendEmailForgotPassword(email)
      }
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }

  async forgotPassword (body: any): Promise<void> {
    try {
      const { email, code, password } = body
      await this.userService.changePassword(email, code, password)
    } catch (error: any) {
      if (error.status === null || error.status === undefined) {
        throw createHttpError(500, error.message)
      } else {
        throw error
      }
    }
  }
}

export default UserController
