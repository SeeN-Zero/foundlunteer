import { type User, PrismaClient, type Token } from '@prisma/client'

class UserRepository {
  prisma = new PrismaClient()
  // async getUser (userId: string): Promise<any> {
  //   return this.prisma.user.findUniqueOrThrow({
  //     where: {
  //       id: userId
  //     },
  //     select: {
  //       id: true,
  //       email: true,
  //       name: true,
  //       address: true,
  //       phone: true
  //     }
  //   })
  // }

  async getUserByEmail (email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async updateUser (id: string, data: any): Promise<any> {
    return this.prisma.user.update({
      where: {
        id
      },
      data
    })
  }

  async createCode (email: string, code: number, createdAt: any, expireAt: any): Promise<void> {
    await this.prisma.token.upsert({
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

  async updateCode (email: string): Promise<void> {
    await this.prisma.token.update({
      where: { email },
      data: {
        isValid: false
      }
    })
  }

  async getCode (email: string): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: { email }
    })
  }

  async updatePassword (email: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password }
    })
  }

  async getIndividualRegisteredOrganizationId (individualId: string): Promise<any> {
    return this.prisma.registration.findMany({
      where: { individualId },
      select: {
        job: {
          select: {
            organization: {
              select: { id: true }
            }
          }
        }
      }
    })
  }
}

export default UserRepository
