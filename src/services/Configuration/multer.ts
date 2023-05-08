import multer from 'multer'
import createHttpError from 'http-errors'

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb) {
    if (file.fieldname === 'image') {
      cb(null, './src/storage/image')
    } else if (file.fieldname === 'cv') {
      cb(null, './src/storage/cv')
    } else if (file.fieldname === 'ijazah') {
      cb(null, './src/storage/ijazah')
    } else if (file.fieldname === 'sertifikat') {
      cb(null, './src/storage/sertifikat')
    }
  },
  filename: function (req: any, file: any, cb: any) {
    const { id }: { id: string } = req.user
    if (file.fieldname === 'image') {
      cb(null, id + '.png')
    } else if (file.fieldname === 'cv' || file.fieldname === 'ijazah' || file.fieldname === 'sertifikat') {
      cb(null, id + '.pdf')
    }
  }
})

const fileFilter = (req: any, file: any, cb: any): any => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    return cb(createHttpError(400, 'File must be pdf'), false)
  }
}

const imageFilter = (req: any, file: any, cb: any): any => {
  if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    return cb(createHttpError(400, 'Image uploaded is not of type jpg/jpeg/png'), false)
  }
}

const uploadFile = multer({ limits: { fileSize: 5242880 }, fileFilter, storage })
  .fields([
    {
      name: 'cv',
      maxCount: 1
    },
    {
      name: 'ijazah',
      maxCount: 1
    },
    {
      name: 'sertifikat',
      maxCount: 1
    }
  ])

const uploadImage = multer({ limits: { fileSize: 5242880 }, fileFilter: imageFilter, storage })
  .single('image')
export { uploadFile, uploadImage }
