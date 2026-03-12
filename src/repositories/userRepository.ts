import { type Prisma, type Token, type User } from '@prisma/client'
import prisma from './prisma'
async function getUserByEmail (email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}
async function updateUser (id: string, data: Prisma.UserUpdateInput): Promise<User> {
  return await prisma.user.update({
    where: {
      id
    },
    data
  })
}
async function createCode (email: string, code: number, createdAt: Date, expireAt: Date): Promise<void> {
  await prisma.token.upsert({
    where: { email },
    update: {
      code,
      isValid: true,
      createdAt,
      expireAt
    },
    create: {
      userEmail: {
        connect: {
          email
        }
      },
      code,
      isValid: true,
      createdAt,
      expireAt
    }
  })
}
async function updateCode (email: string): Promise<void> {
  await prisma.token.update({
    where: { email },
    data: {
      isValid: false
    }
  })
}
async function getCode (email: string): Promise<Token | null> {
  return await prisma.token.findUnique({
    where: { email }
  })
}
async function updatePasswordUsingEmail (email: string, password: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: { password }
  })
}
async function updatePasswordUsingId (id: string, password: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { password }
  })
}
async function getIndividualRegisteredOrganizationId (individualId: string, organizationId: string): Promise<Array<{ individualId: string, jobId: string }>> {
  return await prisma.registration.findMany({
    where: {
      individualId,
      job: {
        organizationId
      }
    },
    select: {
      individualId: true,
      jobId: true
    }
  })
}
async function updateImageStatus (individualId: string, image: boolean | null): Promise<void> {
  await prisma.user.update({
    where: {
      id: individualId
    },
    data: {
      image
    }
  })
}

export {
  getUserByEmail,
  updateUser,
  createCode,
  updateCode,
  getCode,
  updatePasswordUsingEmail,
  updatePasswordUsingId,
  getIndividualRegisteredOrganizationId,
  updateImageStatus
}
