import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import express from 'express'
import Product from '../src/models/product.model'
import User from '../src/models/user.model'
import productRoutes from '../src/routes/product.routes'
import jwt from 'jsonwebtoken'
import authRoutes from '../src/routes/auth.routes'

const app = express()
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/products', productRoutes)

describe('Produits', () => {
  let adminToken: string
  let adminUser: any

  beforeAll(async () => {
    console.log('connexion à la BDD')
    try {
      await mongoose.connect('mongodb://esgi:esgi@database:27017', {
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 20000
      })
    }
    catch (error) {
      console.error('Erreur de connexion :', error)
      throw error
    }
    await Product.deleteMany({})
    await User.deleteMany({})

    adminUser = new User({
      firstname: 'Admin',
      lastname: 'Test',
      email: 'ok3@ok.ok',
      password: 'Azertyuiop!8!',
      roles: ['ROLE_ADMIN'],
      isActive: true
    })
    await adminUser.save()

    adminToken = jwt.sign(
      { userId: adminUser._id, roles: adminUser.roles },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )
  })

  afterAll(async () => {
    await Product.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  describe('Gestion des produits', () => {
    it('Création d\'un produit', async () => {
      const productData = {
        name: 'Test Produit',
        description: 'Description du produit test',
        price: 99,
        stock: 10,
        images: 'image1.jpg'
      }

      const response = await request(app)
        .post('/products/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('name', productData.name)
      expect(response.body).toHaveProperty('price', productData.price)
      expect(response.body).toHaveProperty('stock', productData.stock)
    })

    it('Récupération de tous les produits', async () => {
      const response = await request(app)
        .get('/products')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('Mise à jour d\'un produit', async () => {
      const product = new Product({
        name: 'Produit à modifier',
        description: 'Description initiale',
        price: 50,
        stock: 5
      })
      await product.save()

      const updateData = {
        name: 'Produit modifié',
        price: 75
      }

      const response = await request(app)
        .put(`/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', updateData.name)
      expect(response.body).toHaveProperty('price', updateData.price)
    })

    it('Suppression d\'un produit', async () => {
      const product = new Product({
        name: 'Produit à supprimer',
        description: 'Description',
        price: 25,
        stock: 3
      })
      await product.save()

      const response = await request(app)
        .delete(`/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const deletedProduct = await Product.findById(product._id)
      expect(deletedProduct).toBeNull()
    })

    it('Récupération d\'un produit inexistant', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const response = await request(app)
        .get(`/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
    })
  })
})