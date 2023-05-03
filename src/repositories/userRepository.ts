import { type User, PrismaClient } from '@prisma/client'

class UserRepository {
  prisma = new PrismaClient()
  async getUser (userId: string): Promise<any> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        phone: true
      }
    })
  }

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
}

export default UserRepository
