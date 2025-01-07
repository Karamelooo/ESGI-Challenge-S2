import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Cart from '../models/cart.model'
import Product from '../models/product.model'

// Get Cart for a User
export async function getCart(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ message: 'Token manquant' })
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const userId = decoded.userId

    const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price images stock')
    if (!cart) {
      res.status(404).json({ message: 'Panier non trouvé' })
      return
    }

    const total = cart.items.reduce(
      (sum: any, item: any) => sum + item.quantity * (item.productId as any).price,
      0,
    )

    res.json({ cart, total })
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du panier', error })
  }
}

// Add Item to Cart
export async function addToCart(req: Request, res: Response): Promise<void> {
  const { productId, quantity } = req.body
  
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ message: 'Token manquant' })
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const userId = decoded.userId

    if (!productId || quantity === undefined) {
      res.status(400).json({ message: 'Les champs productId et quantity sont requis' })
      return
    }

    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ message: 'Produit non trouvé' })
      return
    }

    if (product.stock < quantity) {
      res.status(400).json({ message: 'Quantité demandée non disponible en stock' })
      return
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    const cartItem = cart.items.find(item => item.productId.equals(productId))
    if (cartItem) {
      cartItem.quantity += quantity
    }
    else {
      cart.items.push({ productId, quantity })
    }

    await cart.save()
    res.status(200).json({ message: 'Produit ajouté au panier', cart })
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout au panier', error })
  }
}

// Remove Item from Cart
export async function removeFromCart(req: Request, res: Response): Promise<void> {
  const { productId } = req.body

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ message: 'Token manquant' })
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const userId = decoded.userId

    if (!productId) {
      res.status(400).json({ message: 'Le champ productId est requis' })
      return
    }

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      res.status(404).json({ message: 'Panier non trouvé' })
      return
    }

    cart.items = cart.items.filter((item: any) => !item.productId.equals(productId))
    await cart.save()

    res.json({ message: 'Produit retiré du panier', cart })
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit du panier', error })
  }
}

// Clear Cart
export async function clearCart(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ message: 'Token manquant' })
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const userId = decoded.userId

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      res.status(404).json({ message: 'Panier non trouvé' })
      return
    }

    cart.items = []
    await cart.save()

    res.json({ message: 'Panier vidé avec succès' })
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vidange du panier', error })
  }
}
