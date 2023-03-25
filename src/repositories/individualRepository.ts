import { type Individual, PrismaClient } from '@prisma/client'

class IndividualRepository {
  prisma = new PrismaClient()

  async addIndividual (individual: Individual): Promise<void> {
    await this.prisma.individual.create({
      data: {
        ...individual,
        saved: {
          create: {
            id: undefined
          }
        }
      }
    })
  }

  async getIndividualByEmail (email: string): Promise<Individual | null> {
    return this.prisma.individual.findUnique({
      where: {
        email
      }
    })
  }

  async getIndividualById (individualId: string): Promise<any> {
    return this.prisma.individual.findUniqueOrThrow({
      where: {
        id: individualId
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        phone: true,
        age: true,
        description: true,
        social: true
      }
    })
  }

  async updateIndividual (individual: Individual): Promise<Individual> {
    return this.prisma.individual.update({
      where: {
        id: individual.id
      },
      data: individual
    })
  }

  async saveJob (individualId: string, jobId: string): Promise<void> {
    await this.prisma.listSaved.update({
      where: { individualId },
      data: {
        jobs: {
          connect: [{ id: jobId }]
        }
      }
    })
  }

  async deleteJob (individualId: string, jobId: string): Promise<void> {
    await this.prisma.listSaved.update({
      where: { individualId },
      data: {
        jobs: {
          disconnect: [{ id: jobId }]
        }
      }
    })
  }

  async checkSavedJob (individualId: string, jobId: string): Promise<any> {
    return this.prisma.listSaved.findMany({
      where: {
        AND: [
          {
            individualId: {
              equals: individualId
            }
          },
          {
            jobs: {
              some: {
                id: jobId
              }
            }
          }]
      }
    })
  }

  async getIndividualSavedJob (individualId: string): Promise<any> {
    return this.prisma.individual.findUniqueOrThrow({
      where: {
        id: individualId
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        phone: true,
        age: true,
        description: true,
        social: true,
        saved: {
          include: {
            jobs: true
          }
        }
      }
    })
  }
}

export default IndividualRepository
