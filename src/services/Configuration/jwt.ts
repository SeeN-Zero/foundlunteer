import { type Role } from '@prisma/client'
import JsonWebToken from 'jsonwebtoken'

async function generateJwt (id: string, role: Role): Promise<string> {
  const key = process.env.TOKEN_KEY as string
  return JsonWebToken.sign({ id, role }, key, { expiresIn: '1d', algorithm: 'HS256' })
}

export { generateJwt }
