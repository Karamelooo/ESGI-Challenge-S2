import type { Request, Response } from 'express'
import Product from '../models/product.model'

// Obtenir tous les produits
export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await Product.find().populate('category')
    res.json(products)
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error })
  }
}

// Créer un produit
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, price, category, stock, images } = req.body

    if (!name || price === undefined || stock === undefined) {
      res.status(422).json({ message: 'Les champs nom, prix et stock sont requis' })
      return
    }

    const newProduct = new Product({ name, description, price, category, stock, images })
    await newProduct.save()
    res.status(201).json(newProduct)
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du produit', error })
  }
}

// Mettre à jour un produit
export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }).populate('category')
    if (!updatedProduct) {
      res.status(404).json({ message: 'Produit non trouvé' })
      return
    }
    res.json(updatedProduct)
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du produit', error })
  }
}

// Supprimer un produit
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      res.status(404).json({ message: 'Produit non trouvé' })
      return
    }
    res.status(204).send()
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression du produit', error })
  }
}
