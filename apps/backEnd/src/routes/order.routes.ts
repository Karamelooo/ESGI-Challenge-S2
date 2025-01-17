import { Router } from 'express'
import * as orderController from '../controllers/order.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { checkRole } from '../middlewares/role.middleware'

const router = Router()

router.get('/user', authMiddleware, orderController.getOrdersByUserId)
router.get('/', orderController.getOrders)
router.get('/:id', orderController.getOrderById)
router.post('/create', orderController.createOrder)
router.put('/:id', authMiddleware, checkRole(['ROLE_ADMIN']), orderController.updateOrder)
router.delete('/:id', authMiddleware, checkRole(['ROLE_ADMIN']), orderController.deleteOrder)

export default router
