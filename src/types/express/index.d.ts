import { type Role } from '@prisma/client'
import * as express from 'express'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string
      role: Role// or other type you would like to use
    }
  }
}
