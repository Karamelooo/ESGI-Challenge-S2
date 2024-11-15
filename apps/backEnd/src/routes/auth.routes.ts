import { Router } from 'express'
import { login } from '../controllers/login.controller'
import { logout } from '../controllers/logout.controller'
import { register } from '../controllers/register.controller'

const router = Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

export default router
