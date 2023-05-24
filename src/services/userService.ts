import { addIndividual, getIndividualById } from '../repositories/individualRepository'
import { addOrganization, getOrganizationById } from '../repositories/organizationRepository'
import createHttpError from 'http-errors'
import { Role, type User } from '@prisma/client'
import { sendEmail } from './Configuration/email'
import { encode, compare } from './Configuration/passwordEncoder'
import { generateJwt } from './Configuration/jwt'
import {
  getUserByEmail,
  updateUser,
  createCode,
  updateCode,
  getCode,
  updatePasswordUsingEmail,
  updatePasswordUsingId,
  getIndividualRegisteredOrganizationId,
  updateImageStatus
} from '../repositories/userRepository'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { type IndividualDto, type OrganizationDto } from '../dto/userDto'

async function addUserService (user: User): Promise<void> {
  user.password = await encode(user.password)
  if (user.role === Role.INDIVIDUAL) {
    await addIndividual(user)
      .catch((error) => {
        if (error.code === 'P2002') {
          throw createHttpError(400, 'Email Already In Use')
        } else {
          throw error
        }
      })
  } else {
    await addOrganization(user)
      .catch((error) => {
        if (error.code === 'P2002') {
          throw createHttpError(400, 'Email Already In Use')
        } else {
          throw error
        }
      })
  }
}

async function loginUserService (user: User, login: { email: string, password: string }): Promise<{ token: string }> {
  if (user !== null) {
    await compare(login.password, user.password)
    const token = await generateJwt(user.id, user.role)
    return {
      token
    }
  } else {
    throw createHttpError(401, 'Incorrect Email Or Password')
  }
}

async function getUserByEmailService (email: string): Promise<User | null> {
  return await getUserByEmail(email)
}

async function getUserService (id: string, role: Role): Promise<OrganizationDto | IndividualDto> {
  if (role === Role.INDIVIDUAL) {
    return await getIndividualById(id)
  } else {
    return await getOrganizationById(id)
  }
}

async function updateUserService (id: string, user: any): Promise<void> {
  await updateUser(id, user)
}

async function sendEmailForgotPasswordService (targetMail: string): Promise<void> {
  const code = Math.floor(Math.random() * 9000 + 1000)
  // Expire after 30 minutes
  const createdAt = new Date(Date.now()).toISOString()
  const expiredAt = new Date(Date.now() + 0.5 * (60 * 60 * 1000)).toISOString()
  await createCode(targetMail, code, createdAt, expiredAt)
  await sendEmail(targetMail, { code }, 'email.html', 'Foundlunteer Forgot Password')
}

async function changeForgotPasswordService (email: string, code: number, password: string): Promise<void> {
  const user = await getCode(email)
  if (user !== null) {
    const currentDate = new Date(Date.now())
    if (code === user.code && currentDate < user.expireAt && user.isValid) {
      const newPassword = await encode(password)
      await updatePasswordUsingEmail(email, newPassword)
      await updateCode(email)
    } else {
      throw createHttpError(400, 'Code Invalid')
    }
  } else {
    throw createHttpError(404, 'Data Not Found')
  }
}

async function checkDownloadAuthorizationService (requestedId: string, requesterId: string): Promise<string> {
  if (requestedId !== undefined && requestedId !== requesterId) {
    const idList = await getIndividualRegisteredOrganizationId(requestedId, requesterId)
    if (idList.length !== 0) {
      return requestedId
    }
    throw createHttpError(403, 'No Privilege')
  } else {
    return requesterId
  }
}

async function changePasswordService (id: string, newPassword: string): Promise<void> {
  await updatePasswordUsingId(id, newPassword)
}

function updateStatusImageService (individualId: string): void {
  const _dirname = dirname(fileURLToPath(import.meta.url))
  let image
  const filePathCv = path.join(_dirname, '../storage/image', individualId + '.png')
  if (fs.existsSync(filePathCv)) {
    image = true
  } else {
    image = null
  }
  updateImageStatus(individualId, image)
    .catch((e) => {
      throw (e)
    })
}

export {
  addUserService,
  loginUserService,
  getUserByEmailService,
  getUserService,
  updateUserService,
  sendEmailForgotPasswordService,
  changeForgotPasswordService,
  checkDownloadAuthorizationService,
  changePasswordService,
  updateStatusImageService
}
