import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import express from 'express'
import Product from '../src/models/product.model'
import User from '../src/models/user.model'
import Cart from '../src/models/cart.model'
import cartRoutes from '../src/routes/cart.routes'
import authRoutes from '../src/routes/auth.routes'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/cart', cartRoutes)

describe('Panier', () => {
  let userToken: string
  let testUser: any
  let testProduct: any

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
    await Cart.deleteMany({})

    testUser = new User({
      firstname: 'John',
      lastname: 'Doe',
      email: 'ok2@ok.ok',
      password: 'Azertyuiop!8!',
      isActive: true
    })
    await testUser.save()

    testProduct = new Product({
      name: 'Produit test',
      description: 'Description test',
      price: 99,
      stock: 10
    })
    await testProduct.save()

    userToken = jwt.sign(
      { userId: testUser._id, roles: testUser.roles },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )
  })

  afterAll(async () => {
    await Product.deleteMany({})
    await User.deleteMany({})
    await Cart.deleteMany({})
    await mongoose.connection.close()
  })

  describe('Gestion du panier', () => {
    it('Ajout d\'un produit au panier', async () => {
      const cartData = {
        productId: testProduct._id,
        quantity: 2
      }

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartData)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Produit ajouté au panier')
      expect(response.body.cart.items).toHaveLength(1)
      expect(response.body.cart.items[0].quantity).toBe(2)
    })

    it('Récupération du panier', async () => {
      const response = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(200)
      expect(response.body.cart).toHaveProperty('items')
    })

    it('Suppression d\'un produit du panier', async () => {
      const response = await request(app)
        .post('/cart/remove')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: testProduct._id })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Produit retiré du panier')
    })
  })

  describe('Après paiement', () => {
    it('Vidage du panier', async () => {
      const response = await request(app)
        .post('/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Panier vidé avec succès')

      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)

      expect(cartResponse.body.cart.items).toHaveLength(0)
    })
  })
}) 