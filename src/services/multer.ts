import multer from 'multer'
import path from 'path'
import createHttpError from 'http-errors'

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb) {
    cb(null, './src/image')
  },
  filename: function (req: any, file: any, cb: any) {
    const { id }: { id: string } = req.user
    cb(null, id + path.extname(file.originalname))
  }
})

const fileFilter = (req: any, file: any, cb: any): any => {
  if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    return cb(createHttpError(400, 'Image uploaded is not of type jpg/jpeg/png'), false)
  }
}

const upload = multer({ limits: { fileSize: 5242880 }, fileFilter, storage }).single('image')

export { upload }
