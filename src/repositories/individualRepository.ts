import { type Individual, PrismaClient, RegistrationStatus, type User } from '@prisma/client'

class IndividualRepository {
  prisma = new PrismaClient()

  async addIndividual (user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        ...user,
        Individual: {
          create: {
            list: {
              create: {
                id: undefined
              }
            }
          }
        }
      }
    })
  }

  // async getIndividualByEmail (email: string): Promise<Individual | null> {
  //   return this.prisma.individual.findUnique({
  //     where: {
  //       email
  //     }
  //   })
  // }

  async getIndividualById (individualId: string): Promise<any> {
    return this.prisma.individual.findUniqueOrThrow({
      where: {
        id: individualId
      },
      select: {
        age: true,
        description: true,
        social: true,
        registered: {
          select: {
            registrationStatus: true,
            job: {
              include: {
                organization: {
                  select: {
                    user: {
                      select: {
                        email: true,
                        name: true,
                        address: true,
                        phone: true
                      }
                    },
                    leader: true,
                    description: true,
                    social: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  async updateIndividual (id: string, individual: any): Promise<Individual> {
    return this.prisma.individual.update({
      where: {
        id
      },
      data: individual
    })
  }

  async saveJob (individualId: string, jobId: string): Promise<void> {
    await this.prisma.userList.update({
      where: { individualId },
      data: {
        jobs: {
          connect: [{ id: jobId }]
        }
      }
    })
  }

  async deleteJob (individualId: string, jobId: string): Promise<void> {
    await this.prisma.userList.update({
      where: { individualId },
      data: {
        jobs: {
          disconnect: [{ id: jobId }]
        }
      }
    })
  }

  async checkSavedJob (individualId: string, jobId: string): Promise<any> {
    return this.prisma.userList.findMany({
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
    return this.prisma.userList.findUniqueOrThrow({
      where: {
        individualId
      },
      include: {
        jobs: {
          include: {
            organization: {
              select: {
                user: {
                  select: {
                    email: true,
                    name: true,
                    address: true,
                    phone: true
                  }
                },
                leader: true,
                description: true,
                social: true
              }
            }
          }
        }
      }
    })
  }

  async registerIndividualJob (individualId: string, jobId: string): Promise<void> {
    await this.prisma.individual.update({
      where: { id: individualId },
      data: {
        registered: {
          create: {
            registrationStatus: RegistrationStatus.ONPROCESS,
            job: {
              connect: {
                id: jobId
              }
            }
          }
        }
      }
    })
  }
}

export default IndividualRepository
