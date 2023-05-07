import createHttpError from 'http-errors'
import UserService from '../services/userService'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { type NextFunction, type Request, type Response } from 'express'
import { upload } from '../services/Configuration/multer'

const userService = new UserService()

async function addUser (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body.role = req.body.role.toUpperCase()
    await userService.addUser(req.body)
    res.status(200).json({ message: 'success' })
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

// TODO : Add Barrier For Email Activation
async function loginUser (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserByEmail(req.body.email)
    const token = await userService.loginUser(user, req.body)
    res.status(200).json(token)
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function getUser (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id, role } = req.user
      const userRes = await userService.getUser(id, role)
      res.status(200).json(userRes)
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

function uploadUserFile (req: Request, res: Response, next: NextFunction): void {
  upload(req, res, function (error) {
    if (error !== undefined) {
      next(error)
    }
    res.status(200).json({ message: 'success' })
  })
}

async function getUserImage (req: Request, res: Response): Promise<void> {
  if (req.user !== undefined) {
    const { id } = req.user
    const _dirname = dirname(fileURLToPath(import.meta.url))
    const imagePath = path.join(_dirname, '../storage/image', id + '.png')
    res.sendFile(imagePath, (error) => {
      if (error !== undefined) {
        res.status(404).json({ message: 'Image Not Found' })
      }
    })
  }
}

async function getUserCv (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      let id: string
      if (req.params.userId !== undefined && req.params.userId !== req.user.id) {
        id = await userService.checkCvDownloadAuthorization(req.params.userId, req.user.id)
      } else {
        id = req.user.id
      }
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/cv', id + '.pdf')
      res.download(imagePath, (error) => {
        if (error !== undefined) {
          res.status(404).json({ message: 'CV Not Found' })
        }
      })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function sendCode (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserByEmail(req.body.email)
    if (user !== null) {
      await userService.sendEmailForgotPassword(req.body.email)
    }
    res.status(200).json({ message: 'success' })
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function forgotPassword (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, code, password } = req.body
    await userService.changePassword(email, code, password)
    res.status(200).json({ message: 'success' })
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

export {
  addUser,
  loginUser,
  getUser,
  uploadUserFile,
  getUserImage,
  getUserCv,
  sendCode,
  forgotPassword
}
