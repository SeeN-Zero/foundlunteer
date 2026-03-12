import createHttpError from 'http-errors'
import {
  addUserService,
  changeForgotPasswordService,
  changePasswordService,
  checkDownloadAuthorizationService,
  getUserByEmailService,
  getUserService,
  loginUserService,
  sendEmailForgotPasswordService,
  updateStatusImageService
} from '../services/userService'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { type NextFunction, type Request, type Response } from 'express'
import { uploadImage } from '../services/Configuration/multer'
import { type IndividualDto, type OrganizationDto } from '../dto/userDto'
import type { Prisma, Role } from '@prisma/client'

function normalizeParam (value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function handleControllerError (next: NextFunction, error: unknown): void {
  if (createHttpError.isHttpError(error)) {
    next(error)
    return
  }

  const message = error instanceof Error ? error.message : 'Internal Server Error'
  next(createHttpError(500, message))
}

interface AddUserBody {
  email: string
  password: string
  name: string
  address: string
  phone: string
  role: string
}

interface LoginBody {
  email: string
  password: string
}

interface EmailBody {
  email: string
}

interface ForgotPasswordBody {
  email: string
  code: number
  password: string
}

interface ChangePasswordBody {
  password: string
}

async function addUserController (req: Request<Record<string, string>, unknown, AddUserBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: Prisma.UserCreateInput = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      role: req.body.role.toUpperCase() as Role
    }
    await addUserService(user)
    res.status(200).json({ message: 'success' })
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

// TODO : Add Barrier For Email Activation
async function loginUserController (req: Request<Record<string, string>, unknown, LoginBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserByEmailService(req.body.email)
    const token = await loginUserService(user, { email: req.body.email, password: req.body.password })
    res.status(200).json(token)
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getUserController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id, role } = req.user
      const userRes: IndividualDto | OrganizationDto = await getUserService(id, role)
      res.status(200).json(userRes)
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

function uploadUserImageController (req: Request, res: Response, next: NextFunction): void {
  if (req.user !== undefined) {
    const { id } = req.user
    uploadImage(req, res, function (error: unknown) {
      if (error !== undefined) {
        if (error instanceof Error && 'code' in error && error.code === 'LIMIT_FILE_SIZE') {
          next(createHttpError(400, error.message))
        } else {
          handleControllerError(next, error)
        }
      } else {
        updateStatusImageService(id)
          .then(() => {
            res.status(200).json({ message: 'success' })
          })
          .catch((error: unknown) => {
            handleControllerError(next, error)
          })
      }
    })
  }
}

async function getUserImageController (req: Request, res: Response): Promise<void> {
  if (req.user !== undefined) {
    const { id } = req.user
    const _dirname = dirname(fileURLToPath(import.meta.url))
    const userId = normalizeParam(req.params.userId)
    const imagePath = path.join(_dirname, '../storage/image', `${userId ?? id}.png`)
    res.sendFile(imagePath, (error) => {
      if (error !== undefined) {
        res.status(404).json({ message: 'Image Not Found' })
      }
    })
  }
}

async function getUserImageUserController (req: Request, res: Response): Promise<void> {
  const _dirname = dirname(fileURLToPath(import.meta.url))
  const userId = normalizeParam(req.params.userId)
  if (userId === undefined) {
    res.status(400).json({ message: 'User Id is required' })
    return
  }
  const imagePath = path.join(_dirname, '../storage/image', `${userId}.png`)
  res.sendFile(imagePath, (error) => {
    if (error !== undefined) {
      res.status(404).json({ message: 'Image Not Found' })
    }
  })
}

async function getUserCvController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const finalId = await checkDownloadAuthorizationService(normalizeParam(req.params.userId), id)
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/cv', finalId + '.pdf')
      res.download(imagePath, (error) => {
        if (error !== undefined) {
          res.status(404).json({ message: 'CV Not Found' })
        }
      })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getUserIjazahController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const finalId = await checkDownloadAuthorizationService(normalizeParam(req.params.userId), id)
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/ijazah', finalId + '.pdf')
      res.download(imagePath, (error) => {
        if (error !== undefined) {
          res.status(404).json({ message: 'Ijazah Not Found' })
        }
      })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function getUserSertifikatController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const finalId = await checkDownloadAuthorizationService(normalizeParam(req.params.userId), id)
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/sertifikat', finalId + '.pdf')
      res.download(imagePath, (error) => {
        if (error !== undefined) {
          res.status(404).json({ message: 'Sertifikat Not Found' })
        }
      })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function sendCodeController (req: Request<Record<string, string>, unknown, EmailBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserByEmailService(req.body.email)
    if (user !== null) {
      await sendEmailForgotPasswordService(req.body.email)
    }
    res.status(200).json({ message: 'success' })
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function forgotPasswordController (req: Request<Record<string, string>, unknown, ForgotPasswordBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, code, password } = req.body
    await changeForgotPasswordService(email, code, password)
    res.status(200).json({ message: 'success' })
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

async function changePasswordController (req: Request<Record<string, string>, unknown, ChangePasswordBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const { password } = req.body
      await changePasswordService(id, password)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: unknown) {
    handleControllerError(next, error)
  }
}

export {
  addUserController,
  loginUserController,
  getUserController,
  uploadUserImageController,
  getUserImageController,
  getUserCvController,
  getUserIjazahController,
  getUserSertifikatController,
  sendCodeController,
  forgotPasswordController,
  changePasswordController,
  getUserImageUserController
}
