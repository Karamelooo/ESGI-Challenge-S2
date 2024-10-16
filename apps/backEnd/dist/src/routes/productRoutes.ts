import express from 'express';
import { createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

router.post('/products', createProduct);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
