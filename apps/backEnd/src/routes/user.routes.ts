import { Router } from 'express'
import * as userController from '../controllers/user.controller'

const router = Router()

router.post('/create', userController.createUser)
router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router
