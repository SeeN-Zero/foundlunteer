import { type JobStatus, type Prisma } from '@prisma/client'
import { type JobDto } from '../dto/jobDto'
import prisma from './prisma'

async function addJob (job: Prisma.JobUncheckedCreateInput): Promise<void> {
  await prisma.job.create({
    data: job
  })
}
async function getAllJob (take: number | undefined, skip: number | undefined, title: string | undefined, location: string | undefined, organization: string | undefined): Promise<JobDto[]> {
  return await prisma.job.findMany({
    take,
    skip,
    where: {
      AND: [{
        title: {
          contains: title,
          mode: 'insensitive'
        }
      }, {
        location: {
          contains: location,
          mode: 'insensitive'
        }
      }, {
        organization: {
          id: {
            equals: organization
          }
        }
      }

      ]
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
  return await prisma.job.findUniqueOrThrow({
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
async function updateJob (jobId: string, organizationId: string, job: Prisma.JobUncheckedUpdateInput): Promise<{ count: number }> {
  return await prisma.job.updateMany({
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
    data: job
  })
}
async function deleteJob (jobId: string, organizationId: string): Promise<{ count: number }> {
  return await prisma.job.deleteMany({
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
  return await prisma.job.updateMany({
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
