import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import Order from '../src/models/order.model'
import Product from '../src/models/product.model.ts'
import User from '../src/models/user.model.ts'

let testUser
let testProduct

describe('tests du modèle Order', () => {
  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017')

    testUser = new User({
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    })

    testProduct = new Product({
      name: 'test unitaire',
      description: 'desc test unitaire',
      price: 420,
      category: null,
      stock: 42,
      images: ['urlImage'],
    })
  })

  beforeEach(async () => {
    // Nettoyage de la collection Order avant chaque test
    await Order.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyage de la collection Order après chaque test
    await Order.deleteMany({})
  })

  afterAll(async () => {
    // Fermeture de la connexion à la base de données
    await User.deleteMany()
    await Product.deleteMany()
    await mongoose.connection.close()
  })

  it('devrait créer une nouvelle commande', async () => {
    const orderData = {
      user: testUser._id,
      products: [{
        product: testProduct._id,
        quantity: 1,
      }, {
        product: testProduct._id,
        quantity: 1,

      }],
      totalAmount: 42,
      shippingAddress: {
        street: '42 rue du test',
        city: 'test',
        postalCode: '69420',
        country: 'unitaire',
      },
    }

    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()

    expect(savedOrder._id).toBeDefined()
    expect(savedOrder.shippingAddress).toEqual(orderData.shippingAddress)
  })

  it('devrait récupérer une commande par son ID', async () => {
    const orderData = {
      user: testUser._id,
      products: [{
        product: '677cea50ba532b54f315b8f8',
        quantity: 1,
      }, {
        product: '677cea58ba532b54f315b8fb',
        quantity: 1,

      }],
      totalAmount: 42,
      shippingAddress: {
        street: '42 rue du test',
        city: 'test',
        postalCode: '69420',
        country: 'unitaire',
      },
    }

    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()

    const foundOrder = await Order.findById(savedOrder._id)
    expect(foundOrder).not.toBeNull()
    expect(foundOrder?.shippingAddress).toEqual(orderData.shippingAddress)
  })

  it('devrait mettre à jour une commande existante', async () => {
    const orderData = {
      user: testUser._id,
      products: [{
        product: '677cea50ba532b54f315b8f8',
        quantity: 1,
      }, {
        product: '677cea58ba532b54f315b8fb',
        quantity: 1,

      }],
      totalAmount: 42,
      shippingAddress: {
        street: '42 rue du test',
        city: 'test',
        postalCode: '69420',
        country: 'unitaire',
      },
    }

    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()

    const updatedData = { shippingAddress: {
      street: '4 avenue du test',
      city: 'testCity',
      postalCode: '420',
      country: 'testland',
    } }
    const updatedOrder = await Order.findByIdAndUpdate(savedOrder._id, updatedData, { new: true })

    expect(updatedOrder).not.toBeNull()
    expect(updatedOrder?.shippingAddress).toEqual(updatedData.shippingAddress)
  })

  it('devrait supprimer une commande', async () => {
    const orderData = {
      user: testUser._id,
      products: [{
        product: '677cea50ba532b54f315b8f8',
        quantity: 1,
      }, {
        product: '677cea58ba532b54f315b8fb',
        quantity: 1,

      }],
      totalAmount: 42,
      shippingAddress: {
        street: '42 rue du test',
        city: 'test',
        postalCode: '69420',
        country: 'unitaire',
      },
    }

    const newOrder = new Order(orderData)
    const savedOrder = await newOrder.save()

    await Order.findByIdAndDelete(savedOrder._id)
    const deletedOrder = await Order.findById(savedOrder._id)

    expect(deletedOrder).toBeNull()
  })
})
