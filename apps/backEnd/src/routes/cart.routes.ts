import type { Request, Response } from 'express'
import { Router } from 'express'
import * as cartController from '../controllers/cart.controller'

const router = Router()

router.post('/add', cartController.addToCart)
router.get('/:userId', cartController.getCart)
router.post('/remove', cartController.removeFromCart)
router.post('/clear', cartController.clearCart)
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Cart route is working!' })
})

export default router
