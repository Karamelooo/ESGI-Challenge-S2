import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import Product from '../src/models/product.model'

describe('tests du modèle Product', () => {
  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017')
  })

  beforeEach(async () => {
    // Nettoyage de la collection Product avant chaque test
    await Product.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyage de la collection Product après chaque test
    await Product.deleteMany({})
  })

  afterAll(async () => {
    // Fermeture de la connexion à la base de données
    await mongoose.connection.close()
  })

  it('devrait créer un nouveau Produit', async () => {
    const productData = {
      name: 'test unitaire',
      description: 'desc test unitaire',
      price: 420,
      category: null,
      stock: 42,
      images: ['urlImage'],
    }

    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()

    expect(savedProduct._id).toBeDefined()
    expect(savedProduct.name).toBe(productData.name)
    expect(savedProduct.description).toBe(productData.description)
    expect(savedProduct.price).toBe(productData.price)
    expect(savedProduct.category).toBe(productData.category)
    expect(savedProduct.stock).toBe(productData.stock)
  })

  it('devrait récupérer un produit par son ID', async () => {
    const productData = {
      name: 'test unitaire',
      description: 'desc test unitaire',
      price: 420,
      category: null,
      stock: 42,
      images: ['urlImage'],
    }

    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()

    const foundProduct = await Product.findById(savedProduct._id)
    expect(foundProduct).not.toBeNull()
    expect(foundProduct?.name).toBe(productData.name)
  })

  it('devrait mettre à jour un produit existant', async () => {
    const productData = {
      name: 'test unitaire',
      description: 'desc test unitaire',
      price: 420,
      category: null,
      stock: 42,
      images: ['urlImage'],
    }

    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()

    const updatedData = { name: 'test unitaire 2' }
    const updatedProduct = await Product.findByIdAndUpdate(savedProduct._id, updatedData, { new: true })

    expect(updatedProduct).not.toBeNull()
    expect(updatedProduct?.name).toBe(updatedData.name)
  })

  it('devrait supprimer un produit', async () => {
    const productData = {
      name: 'test unitaire',
      description: 'desc test unitaire',
      price: 420,
      category: null,
      stock: 42,
      images: ['urlImage'],
    }

    const newProduct = new Product(productData)
    const savedProduct = await newProduct.save()

    await Product.findByIdAndDelete(savedProduct._id)
    const deletedProduct = await Product.findById(savedProduct._id)

    expect(deletedProduct).toBeNull()
  })
})
