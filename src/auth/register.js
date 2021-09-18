import express from 'express'
import multer from 'multer'

const from = multer()
const router = express.Router()

import registerValidation from '../controller/registerValidation.js'

router.route('/register')
    .post(from.any(),registerValidation)


export default router