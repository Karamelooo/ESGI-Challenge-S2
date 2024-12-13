import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';

const router = Router();

// Add item to cart
router.post('/cart/add', cartController.addToCart);

// Get cart items
router.get('/cart/:userId', cartController.getCart);

// Remove item from cart
router.post('/cart/remove', cartController.removeFromCart);

// Clear cart
router.post('/cart/clear', cartController.clearCart);

export default router;
