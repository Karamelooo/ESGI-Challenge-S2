import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, userController.getUsers)
router.get('/:id', authMiddleware, userController.getUserById)
router.put('/:id', authMiddleware, userController.updateUser)
router.delete('/:id', authMiddleware, userController.deleteUser)
router.post('/create', userController.createUser)

export default router 