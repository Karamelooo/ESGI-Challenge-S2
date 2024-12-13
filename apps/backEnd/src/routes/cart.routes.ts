import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';

const router = Router();

// Add item to cart
router.post('/add', cartController.addToCart);

// Get cart items
router.get('/:userId', cartController.getCart);

// Remove item from cart
router.post('/remove', cartController.removeFromCart);

// Clear cart
router.post('/clear', cartController.clearCart);

router.get('/test', (req, res) => {
    res.json({ message: 'Cart route is working!' });
  });

export default router;
