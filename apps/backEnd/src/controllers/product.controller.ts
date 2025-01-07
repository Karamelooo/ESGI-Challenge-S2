import type { Request, Response } from 'express'
import Product from '../models/product.model'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Créer le dossier uploads/products s'il n'existe pas
const uploadDir = 'uploads/products'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`) 
  }
})

export const upload = multer({ storage })

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

export async function getProductById(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const product = await Product.findById(id).populate('category')
    res.json(product)
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit', error })
  }
}

// Créer un produit
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, price, stock } = req.body
    const files = req.files as Express.Multer.File[]
    
    const images = files ? files.map(file => `${process.env.BACK_APP_URL}/uploads/products/${file.filename}`) : []

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images
    })

    await newProduct.save()
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    res.status(400).json({ message: 'Erreur lors de la création du produit', error })
  }
}

// Mettre à jour un produit
export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const files = req.files as Express.Multer.File[]
    const productData = { ...req.body }

    if (files && files.length > 0) {
      // Supprimer les anciennes images physiquement
      const oldProduct = await Product.findById(id)
      if (oldProduct?.images) {
        oldProduct.images.forEach((imagePath) => {
          const filePath = imagePath.replace(`${process.env.BACK_APP_URL}/uploads/products/`, '')
          const fullPath = path.join(uploadDir, filePath)
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath)
          }
        })
      }

      productData.images = files.map(file => `${process.env.BACK_APP_URL}/uploads/products/${file.filename}`)
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    ).populate('category')

    if (!updatedProduct) {
      res.status(404).json({ message: 'Produit non trouvé' })
      return
    }
    res.json(updatedProduct)
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du produit', error })
  }
}

// Supprimer un produit
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    if (!product) {
      res.status(404).json({ message: 'Produit non trouvé' })
      return
    }

    // Supprimer les images associées
    if (product.images) {
      product.images.forEach((imagePath) => {
        const fullPath = path.join(__dirname, '../../', imagePath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      })
    }

    await Product.findByIdAndDelete(id)
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression du produit', error })
  }
}
