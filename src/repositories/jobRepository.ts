import { PrismaClient, type Job } from '@prisma/client'

const prisma = new PrismaClient()

async function addJob (job: Job): Promise<void> {
  await prisma.job.create({
    data: job
  })
}

async function getAllJob (take: number | undefined, skip: number | undefined, filter: string | undefined): Promise<any> {
  return prisma.job.findMany({
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
          user: {
            select: {
              id: true,
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
  })
}

async function getJobById (jobId: string): Promise<any> {
  return prisma.job.findUnique({
    where: {
      id: jobId
    },
    select: {
      id: true,
      title: true,
      description: true,
      jobStatus: true,
      createdAt: true,
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
  })
}

async function updateJob (job: Job): Promise<{ count: number }> {
  return prisma.job.updateMany({
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

async function deleteJob (jobId: string, organizationId: string): Promise<{ count: number }> {
  return prisma.job.deleteMany({
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

export {
  addJob,
  getAllJob,
  getJobById,
  updateJob,
  deleteJob
}
