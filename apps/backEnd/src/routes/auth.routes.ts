import { Router } from 'express'
import { login } from '../controllers/login.controller'
import { logout } from '../controllers/logout.controller'
import { register } from '../controllers/register.controller'
import { confirmEmail } from '../controllers/confirm-email.controller'

const router = Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/confirm-email/:token', confirmEmail)

export default router
