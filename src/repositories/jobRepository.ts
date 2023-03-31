import { PrismaClient, type Job } from '@prisma/client'

class JobRepository {
  prisma = new PrismaClient()

  async addJob (job: Job): Promise<void> {
    await this.prisma.job.create({
      data: job
    })
  }

  async getAllJob (take: number | undefined, skip: number | undefined, filter: string | undefined): Promise<any> {
    console.log(filter)
    return this.prisma.job.findMany({
      take,
      skip,
      where: {
        title: {
          contains: filter,
          mode: 'insensitive'
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        jobStatus: true,
        createdAt: true,
        organization: {
          select: {
            name: true,
            email: true,
            address: true,
            phone: true,
            leader: true,
            description: true,
            social: true
          }
        }
      }
    })
  }

  async updateJob (job: Job): Promise<{ count: number }> {
    return this.prisma.job.updateMany({
      where: {
        AND: [
          {
            id: {
              equals: job.id
            }
          },
          {
            organizationId: {
              equals: job.organizationId
            }
          }
        ]
      },
      data: job
    })
  }

  async deleteJob (jobId: string, organizationId: string): Promise<{ count: number }> {
    return this.prisma.job.deleteMany({
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
          }]
      }
    })
  }
}

export default JobRepository
