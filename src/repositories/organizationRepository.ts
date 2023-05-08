import { PrismaClient, type User } from '@prisma/client'

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

async function getOrganizationById (organizationId: string): Promise<any> {
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
          phone: true
        }
      },
      leader: true,
      description: true,
      social: true
    }
  })
}

async function updateOrganization (id: string, organization: any): Promise<any> {
  return prisma.organization.update({
    where: {
      id
    },
    data: organization
  })
}

async function getJob (organizationId: string): Promise<any> {
  return prisma.organization.findUniqueOrThrow({
    where: {
      id: organizationId
    },
    select: {
      job: {
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          title: true,
          description: true,
          jobStatus: true,
          createdAt: true
        }
      }
    }
  })
}

async function getJobDetail (organizationId: string, jobId: string): Promise<any> {
  return prisma.job.findMany({
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
                  phone: true
                }
              },
              age: true,
              description: true,
              social: true
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
  getJobDetail
}
