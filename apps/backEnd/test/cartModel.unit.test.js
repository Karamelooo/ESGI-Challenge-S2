import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import Cart from '../src/models/cart.model.ts'
import Product from '../src/models/product.model.ts'
import User from '../src/models/user.model.ts'

let testProduct
let testUser
let testUser2

describe('tests du modèle Cart', () => {
  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017')

    testProduct = new Product({
      name: 'test unitaire',
      description: 'desc test unitaire',
      price: 420,
      category: null,
      stock: 42,
      images: ['urlImage'],
    })

    testUser = new User({
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    })

    testUser2 = new User({
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    })
  })

  beforeEach(async () => {
    // Nettoyage de la collection Cart avant chaque test
    await Cart.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyage de la collection Cart après chaque test
    await Cart.deleteMany({})
  })

  afterAll(async () => {
    // Fermeture de la connexion à la base de données
    await Product.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  it('devrait créer une nouvelle commande', async () => {
    const cartData = {
      userId: testUser._id,
      items: {
        productId: testProduct._id,
        quantity: 32,
      },
    }

    const newCart = new Cart(cartData)
    const savedCart = await newCart.save()

    expect(savedCart._id).toBeDefined()
    expect(savedCart.userId).toEqual(cartData.userId)
  })

  it('devrait récupérer une commande par son ID', async () => {
    const cartData = {
      userId: testUser._id,
      items: {
        productId: testProduct._id,
        quantity: 32,
      },
    }

    const newCart = new Cart(cartData)
    const savedCart = await newCart.save()

    const foundCart = await Cart.findById(savedCart._id)
    expect(foundCart).not.toBeNull()
    expect(foundCart.userId).toEqual(cartData.userId)
  })

  it('devrait mettre à jour une commande existante', async () => {
    const cartData = {
      userId: testUser._id,
      items: {
        productId: testProduct._id,
        quantity: 32,
      },
    }

    const newCart = new Cart(cartData)
    const savedCart = await newCart.save()

    const updatedData = {
      userId: testUser2._id,
    }
    const updatedCart = await Cart.findByIdAndUpdate(savedCart._id, updatedData, { new: true })

    expect(updatedCart).not.toBeNull()
    expect(updatedCart.userId).toEqual(updatedData.userId)
  })

  it('devrait supprimer une commande', async () => {
    const cartData = {
      userId: testUser._id,
      items: {
        productId: testProduct._id,
        quantity: 32,
      },
    }

    const newCart = new Cart(cartData)
    const savedCart = await newCart.save()

    await Cart.findByIdAndDelete(savedCart._id)
    const deletedCart = await Cart.findById(savedCart._id)

    expect(deletedCart).toBeNull()
  })
})
