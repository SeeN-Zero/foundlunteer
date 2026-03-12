import { type Prisma, type RegistrationStatus } from '@prisma/client'
import { type OrganizationDto } from '../dto/userDto'
import { type JobDto, type JobRegistrantDto } from '../dto/jobDto'
import prisma from './prisma'

async function addOrganization (user: Prisma.UserCreateInput): Promise<void> {
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
  return await prisma.organization.findUniqueOrThrow({
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
async function updateOrganization (id: string, organization: Prisma.OrganizationUpdateInput): Promise<void> {
  await prisma.organization.update({
    where: {
      id
    },
    data: organization
  })
}
async function getJob (organizationId: string): Promise<{ job: JobDto[] }> {
  return await prisma.organization.findUniqueOrThrow({
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
  return await prisma.job.findFirstOrThrow({
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
async function getRegistrantStatus (organizationId: string, jobId: string, individualId: string): Promise<Array<{ registrationStatus: RegistrationStatus }>> {
  return await prisma.registration.findMany({
    where: {
      jobId,
      job: {
        organizationId
      },
      individualId
    },
    select: {
      registrationStatus: true
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
