import { type User, PrismaClient, type Token } from '@prisma/client'

const prisma = new PrismaClient()
async function getUserByEmail (email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}
async function updateUser (id: string, data: any): Promise<any> {
  return prisma.user.update({
    where: {
      id
    },
    data
  })
}
async function createCode (email: string, code: number, createdAt: any, expireAt: any): Promise<void> {
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
  return prisma.token.findUnique({
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
async function getIndividualRegisteredOrganizationId (individualId: string, organizationId: string): Promise<any> {
  return prisma.registration.findMany({
    where: {
      individualId,
      job: {
        organizationId
      }
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
