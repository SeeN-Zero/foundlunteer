import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'

class PasswordEncoder {
  async encode (password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async compare (password: string, passwordHash: string): Promise<boolean> {
    const result: boolean = await bcrypt.compare(password, passwordHash)
    if (!result) {
      throw createHttpError(404, 'Incorrect Email Or Password')
    } else {
      return result
    }
  }
}

export default PasswordEncoder
