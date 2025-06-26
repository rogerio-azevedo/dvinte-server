import multer from 'multer'
import crypto from 'crypto'
import { extname, resolve } from 'path'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req: any, file: any, cb: any) => {
      crypto.randomBytes(16, (err: any, res: any) => {
        if (err) return cb(err)

        return cb(null, res.toString('hex') + extname(file.originalname))
      })
    },
  }),
}
