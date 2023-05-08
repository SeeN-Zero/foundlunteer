import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'

async function encode (password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

async function compare (password: string, passwordHash: string): Promise<boolean> {
  const result: boolean = await bcrypt.compare(password, passwordHash)
  if (!result) {
    throw createHttpError(401, 'Incorrect Email Or Password')
  } else {
    return result
  }
}

export { encode, compare }
