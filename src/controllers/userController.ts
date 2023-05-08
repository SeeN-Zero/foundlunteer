import createHttpError from 'http-errors'
import {
  addUserService,
  loginUserService,
  getUserByEmailService,
  getUserService,
  sendEmailForgotPasswordService,
  changeForgotPasswordService,
  changePasswordService,
  checkDownloadAuthorizationService
} from '../services/userService'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { type NextFunction, type Request, type Response } from 'express'
import { uploadFile, uploadImage } from '../services/Configuration/multer'

async function addUserController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.body.role = req.body.role.toUpperCase()
    await addUserService(req.body)
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
async function loginUserController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserByEmailService(req.body.email)
    const token = await loginUserService(user, req.body)
    res.status(200).json(token)
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function getUserController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id, role } = req.user
      const userRes = await getUserService(id, role)
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

function uploadUserImageController (req: Request, res: Response, next: NextFunction): void {
  uploadImage(req, res, function (error) {
    if (error !== undefined) {
      next(error)
    }
    res.status(200).json({ message: 'success' })
  })
}

function uploadUserFileController (req: Request, res: Response, next: NextFunction): void {
  uploadFile(req, res, function (error) {
    if (error !== undefined) {
      next(error)
    }
    res.status(200).json({ message: 'success' })
  })
}

async function getUserImageController (req: Request, res: Response): Promise<void> {
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

async function getUserCvController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const finalId = await checkDownloadAuthorizationService(req.params.userId, id)
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/cv', finalId + '.pdf')
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

async function getUserIjazahController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const finalId = await checkDownloadAuthorizationService(req.params.userId, id)
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/Ijazah', finalId + '.pdf')
      res.download(imagePath, (error) => {
        if (error !== undefined) {
          res.status(404).json({ message: 'Ijazah Not Found' })
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

async function getUserSertifikatController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const finalId = await checkDownloadAuthorizationService(req.params.userId, id)
      const _dirname = dirname(fileURLToPath(import.meta.url))
      const imagePath = path.join(_dirname, '../storage/sertifikat', finalId + '.pdf')
      res.download(imagePath, (error) => {
        if (error !== undefined) {
          res.status(404).json({ message: 'Sertifikat Not Found' })
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

async function sendCodeController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserByEmailService(req.body.email)
    if (user !== null) {
      await sendEmailForgotPasswordService(req.body.email)
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

async function forgotPasswordController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, code, password } = req.body
    await changeForgotPasswordService(email, code, password)
    res.status(200).json({ message: 'success' })
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

async function changePasswordController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user !== undefined) {
      const { id } = req.user
      const { password } = req.body
      await changePasswordService(id, password)
      res.status(200).json({ message: 'success' })
    }
  } catch (error: any) {
    if (error.status === null || error.status === undefined) {
      next(createHttpError(500, error.message))
    } else {
      next(error)
    }
  }
}

export {
  addUserController,
  loginUserController,
  getUserController,
  uploadUserImageController,
  uploadUserFileController,
  getUserImageController,
  getUserCvController,
  getUserIjazahController,
  getUserSertifikatController,
  sendCodeController,
  forgotPasswordController,
  changePasswordController
}
