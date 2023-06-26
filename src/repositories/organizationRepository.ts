import { PrismaClient, type RegistrationStatus, type User } from '@prisma/client'
import { type OrganizationDto } from '../dto/userDto'
import { type JobDto, type JobRegistrantDto } from '../dto/jobDto'

const prisma = new PrismaClient()

async function addOrganization (user: User): Promise<void> {
  await prisma.user.create({
    data: {
      ...user,
      Organization: {
        create: {
        }
      }
    }
  })
}
async function getOrganizationById (organizationId: string): Promise<OrganizationDto> {
  return prisma.organization.findUniqueOrThrow({
    where: {
      id: organizationId
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
      leader: true,
      description: true,
      social: true
    }
  })
}
async function updateOrganization (id: string, organization: any): Promise<void> {
  await prisma.organization.update({
    where: {
      id
    },
    data: organization
  })
}
async function getJob (organizationId: string): Promise<{ job: JobDto[] }> {
  return prisma.organization.findUniqueOrThrow({
    where: {
      id: organizationId
    },
    select: {
      job: {
        orderBy: {
          createdAt: 'desc'
        },
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
async function getJobDetail (organizationId: string, jobId: string): Promise<JobRegistrantDto> {
  return prisma.job.findFirstOrThrow({
    where: {
      AND: [
        {
          id: {
            equals: jobId
          }
        },
        {
          organizationId: {
            equals: organizationId
          }
        }
      ]
    },
    include: {
      registrant: {
        select: {
          registrationStatus: true,
          individual: {
            select: {
              id: true,
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
          }
        }
      }
    }
  })
}
async function getRegistrantStatus (organizationId: string, jobId: string, individualId: string): Promise<any> {
  return prisma.registration.findMany({
    where: {
      jobId,
      job: {
        organizationId
      },
      individualId
    }
  })
}

async function updateRegistrantStatus (organizationId: string, jobId: string, individualId: string, regsitrantStatus: RegistrationStatus): Promise<void> {
  await prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      job: {
        update: {
          where: {
            id: jobId
          },
          data: {
            registrant: {
              update: {
                where: {
                  individualId_jobId: {
                    individualId,
                    jobId
                  }
                },
                data: {
                  registrationStatus: regsitrantStatus
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
  addOrganization,
  getOrganizationById,
  updateOrganization,
  getJob,
  getJobDetail,
  updateRegistrantStatus,
  getRegistrantStatus
}
