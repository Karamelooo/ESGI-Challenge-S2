import { Router } from 'express'
import * as productController from '../controllers/product.controller'

const router = Router()

router.get('/', productController.getProducts)
router.post('/create', productController.createProduct)
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

export default router