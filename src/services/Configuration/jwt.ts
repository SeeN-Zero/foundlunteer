import { type Role } from '@prisma/client'
import JsonWebToken from 'jsonwebtoken'

async function generateJwt (id: string, role: Role): Promise<string> {
  const key = process.env.TOKEN_KEY
  if (key === undefined) {
    throw new Error('TOKEN_KEY is not configured')
  }
  return JsonWebToken.sign({ id, role }, key, { expiresIn: '1d', algorithm: 'HS256' })
}

export { generateJwt }
