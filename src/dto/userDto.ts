import { type RegistrationStatus, type Role } from '@prisma/client'
import { type JobDto } from './jobDto'

interface UserDto {
  email: string
  name: string
  address: string
  phone: string
  role: Role
}

interface IndividualDto {
  id?: string
  user: UserDto
  age: number | null
  description: string | null
  social: string | null
}

interface OrganizationDto {
  id?: string
  user: UserDto
  leader: string | null
  description: string | null
  social: string | null
}
interface RegisteredDto {
  registrationStatus: RegistrationStatus
  job: JobDto
}

interface RegisterantDto {
  registrationStatus: RegistrationStatus
  individual: IndividualDto
}

interface FileStatusDto {
  cv: boolean | null
  ijazah: boolean | null
  sertifikat?: boolean | null
}

export type { IndividualDto, OrganizationDto, RegisteredDto, FileStatusDto, RegisterantDto }
