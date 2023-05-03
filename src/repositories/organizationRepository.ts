import { PrismaClient, type User } from '@prisma/client'

class OrganizationRepository {
  prisma = new PrismaClient()

  async addOrganization (user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        ...user,
        Organization: {
          create: {
          }
        }
      }
    })
  }

  // async getOrganizationByEmail (email: string): Promise<Organization | null> {
  //   return this.prisma.organization.findUnique({
  //     where: {
  //       email
  //     }
  //   })
  // }

  async getOrganizationById (id: string): Promise<any> {
    return this.prisma.organization.findUniqueOrThrow({
      where: {
        id
      },
      select: {
        leader: true,
        description: true,
        social: true,
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

  async updateOrganization (id: string, organization: any): Promise<any> {
    return this.prisma.organization.update({
      where: {
        id
      },
      data: organization
    })
  }

  async getJobDetail (organizationId: string, jobId: string): Promise<any> {
    return this.prisma.job.findMany({
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
}

export default OrganizationRepository
