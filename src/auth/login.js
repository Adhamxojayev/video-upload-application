import express from 'express'
import multer from 'multer'

const router = express.Router()

const from = multer()
import loginValidation from '../controller/loginValidation.js'

router.route('/login')
    .post(from.any(),loginValidation)


export default router