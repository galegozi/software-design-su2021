import express from 'express'
import auth from './auth'
import profile from './profile'
import quote from './quote'

const router = express.Router()

router.use(auth)
router.use(profile)
router.use(quote)

export default router
