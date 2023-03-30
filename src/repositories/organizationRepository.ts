import { type Organization, PrismaClient } from '@prisma/client'

class OrganizationRepository {
  prisma = new PrismaClient()

  async addOrganization (organization: Organization): Promise<void> {
    await this.prisma.organization.create({
      data: organization
    })
  }

  async getOrganizationByEmail (email: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: {
        email
      }
    })
  }

  async getOrganizationById (id: string): Promise<any> {
    return this.prisma.organization.findUniqueOrThrow({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        phone: true,
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

  async updateOrganization (organization: Organization): Promise<Organization> {
    return this.prisma.organization.update({
      where: {
        id: organization.id
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
                email: true,
                name: true,
                address: true,
                phone: true,
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
