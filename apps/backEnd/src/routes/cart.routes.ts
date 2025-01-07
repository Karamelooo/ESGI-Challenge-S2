import type { Request, Response } from 'express'
import { Router } from 'express'
import * as cartController from '../controllers/cart.controller'

const router = Router()

router.post('/add', cartController.addToCart)
router.post('/remove', cartController.removeFromCart)
router.post('/clear', cartController.clearCart)
router.get('/', cartController.getCart)

export default router
