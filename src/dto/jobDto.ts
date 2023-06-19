import { type OrganizationDto, type RegisterantDto } from './userDto'

interface JobDto {
  id: string
  title: string
  description: string
  location: string
  jobStatus: string
  organizationId: string
  createdAt: Date
  expiredAt: Date
  organization: OrganizationDto
}

interface JobRegistrantDto {
  id: string
  title: string
  description: string
  location: string
  jobStatus: string
  organizationId: string
  createdAt: Date
  expiredAt: Date
  registrant: RegisterantDto[]
}

export type { JobDto, JobRegistrantDto }
