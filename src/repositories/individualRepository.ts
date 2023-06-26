import { PrismaClient, RegistrationStatus, type User } from '@prisma/client'
import { type FileStatusDto, type IndividualDto, type RegisteredDto } from '../dto/userDto'
import { type JobDto } from '../dto/jobDto'

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
async function getIndividualById (individualId: string): Promise<IndividualDto> {
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
          phone: true,
          role: true
        }
      },
      birthOfDate: true,
      description: true,
      social: true
    }
  })
}
async function updateIndividual (id: string, individual: any): Promise<void> {
  await prisma.individual.update({
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
async function checkSavedJob (individualId: string, jobId: string): Promise<number> {
  return prisma.userList.count({
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
async function getIndividualSavedJob (individualId: string): Promise<{ jobs: JobDto[] }> {
  return prisma.userList.findUniqueOrThrow({
    where: {
      individualId
    },
    select: {
      jobs: {
        include: {
          organization: {
            select: {
              user: {
                select: {
                  email: true,
                  name: true,
                  address: true,
                  phone: true,
                  role: true
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
async function getRegisteredJob (individualId: string): Promise<{ registered: RegisteredDto[] }> {
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
                      phone: true,
                      role: true
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
async function updateFileStatus (individualId: string, cv: boolean | null, ijazah: boolean | null, sertifikat: boolean | null): Promise<void> {
  await prisma.individual.update({
    where: {
      id: individualId
    },
    data: {
      cv,
      ijazah,
      sertifikat
    }
  })
}
async function getIndividualFileStatus (individualId: string): Promise<FileStatusDto> {
  return prisma.individual.findUniqueOrThrow({
    where: {
      id: individualId
    },
    select: {
      cv: true,
      ijazah: true,
      sertifikat: true
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
  getRegisteredJob,
  updateFileStatus,
  getIndividualFileStatus
}
