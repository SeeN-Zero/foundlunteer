import multer from 'multer'
import createHttpError from 'http-errors'

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb) {
    if (file.fieldname === 'image') {
      cb(null, './src/storage/image')
    } else if (file.fieldname === 'cv') {
      cb(null, './src/storage/cv')
    }
  },
  filename: function (req: any, file: any, cb: any) {
    const { id }: { id: string } = req.user
    if (file.fieldname === 'image') {
      cb(null, id + '.png')
    } else if (file.fieldname === 'cv') {
      cb(null, id + '.pdf')
    }
  }
})

const fileFilter = (req: any, file: any, cb: any): any => {
  if (file.fieldname === 'image') {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      return cb(createHttpError(400, 'Image uploaded is not of type jpg/jpeg/png'), false)
    }
  } else if (file.fieldname === 'cv') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      return cb(createHttpError(400, 'CV must be pdf'), false)
    }
  }
}

const upload = multer({ limits: { fileSize: 5242880 }, fileFilter, storage })
  .fields([
    {
      name: 'image',
      maxCount: 1
    },
    {
      name: 'cv',
      maxCount: 1
    }
  ])

export { upload }
