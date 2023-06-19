import { PrismaClient, type Job, type JobStatus } from '@prisma/client'
import { type JobDto } from '../dto/jobDto'

const prisma = new PrismaClient()

async function addJob (job: Job): Promise<void> {
  await prisma.job.create({
    data: job
  })
}
async function getAllJob (take: number | undefined, skip: number | undefined, filter: string | undefined): Promise<JobDto[]> {
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
  })
}
async function getJobById (jobId: string): Promise<JobDto> {
  return prisma.job.findUniqueOrThrow({
    where: {
      id: jobId
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
async function updateJobStatus (jobId: string, organizationId: string, jobStatus: JobStatus): Promise<{ count: number }> {
  return prisma.job.updateMany({
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
    data: {
      jobStatus
    }
  })
}

export {
  addJob,
  getAllJob,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus
}
