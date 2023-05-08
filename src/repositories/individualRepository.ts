import { type Individual, PrismaClient, RegistrationStatus, type User } from '@prisma/client'

const prisma = new PrismaClient()
async function addIndividual (user: User): Promise<void> {
  await prisma.user.create({
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
async function getIndividualById (individualId: string): Promise<any> {
  return prisma.individual.findUniqueOrThrow({
    where: {
      id: individualId
    },
    select: {
      user: {
        select: {
          email: true,
          name: true,
          address: true,
          phone: true
        }
      },
      age: true,
      description: true,
      social: true
    }
  })
}
async function updateIndividual (id: string, individual: any): Promise<Individual> {
  return prisma.individual.update({
    where: {
      id
    },
    data: individual
  })
}
async function saveJob (individualId: string, jobId: string): Promise<void> {
  await prisma.userList.update({
    where: { individualId },
    data: {
      jobs: {
        connect: [{ id: jobId }]
      }
    }
  })
}
async function deleteJob (individualId: string, jobId: string): Promise<void> {
  await prisma.userList.update({
    where: { individualId },
    data: {
      jobs: {
        disconnect: [{ id: jobId }]
      }
    }
  })
}
async function checkSavedJob (individualId: string, jobId: string): Promise<any> {
  return prisma.userList.findMany({
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
async function getIndividualSavedJob (individualId: string): Promise<any> {
  return prisma.userList.findUniqueOrThrow({
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
async function registerJob (individualId: string, jobId: string): Promise<void> {
  await prisma.individual.update({
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
async function getRegisteredJob (individualId: string): Promise<any> {
  return prisma.individual.findUniqueOrThrow({
    where: {
      id: individualId
    },
    select: {
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

export {
  addIndividual,
  getIndividualById,
  updateIndividual,
  saveJob,
  deleteJob,
  checkSavedJob,
  getIndividualSavedJob,
  registerJob,
  getRegisteredJob
}
