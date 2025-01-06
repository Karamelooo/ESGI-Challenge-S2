import { Router } from 'express'
import * as productController from '../controllers/product.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { checkRole } from '../middlewares/role.middleware'

const router = Router()

router.get('/', productController.getProducts)
router.get('/:id', productController.getProductById)
router.post('/create', authMiddleware, checkRole(['ROLE_ADMIN']), productController.createProduct)
router.put('/:id', authMiddleware, checkRole(['ROLE_ADMIN']), productController.updateProduct)
router.delete('/:id', authMiddleware, checkRole(['ROLE_ADMIN']), productController.deleteProduct)

export default router
