import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

if (process.env.DATABASE_URL === undefined || process.env.DATABASE_URL === '') {
  throw new Error('DATABASE_URL must be defined')
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
