import { type OrganizationDto, type RegisterantDto } from './userDto'

interface JobDto {
  id: string
  title: string
  description: string
  jobStatus: string
  organizationId: string
  createdAt: Date
  organization: OrganizationDto
}

interface JobRegistrantDto {
  id: string
  title: string
  description: string
  jobStatus: string
  organizationId: string
  createdAt: Date
  registrant: RegisterantDto[]
}

export type { JobDto, JobRegistrantDto }
