import { Router } from 'express'
import { confirmEmail } from '../controllers/confirm-email.controller'
import { login } from '../controllers/login.controller'
import { logout } from '../controllers/logout.controller'
import { register } from '../controllers/register.controller'
import { requestPasswordReset, resetPassword } from '../controllers/reset-password.controller'
import { requestResetPassword, resetPassword } from '../controllers/reset-password.controller'

const router = Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/confirm-email/:token', confirmEmail)

router.post('/reset-password-request', requestResetPassword)
router.post('/reset-password/:token', resetPassword)

export default router
