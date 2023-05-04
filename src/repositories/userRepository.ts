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
        createdAt,
        expireAt
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
}

export default UserRepository
