import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { register } from '../controllers/register.controller'

const router = Router()

router.post('/create', register)
router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router