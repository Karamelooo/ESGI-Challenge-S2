import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import Order from '../src/models/order.model'
import Payment from '../src/models/payment.model'
import User from '../src/models/user.model.ts'

let testOrder
let testUser

describe('tests du modèle Payment', () => {
  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017')
    testOrder = new Order({
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
    })

    testUser = new User({
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    })
  })

  beforeEach(async () => {
    // Nettoyage de la collection Payment avant chaque test
    await Payment.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyage de la collection Payment après chaque test
    await Payment.deleteMany({})
  })

  afterAll(async () => {
    // Fermeture de la connexion à la base de données
    await User.deleteMany()
    await Order.deleteMany()
    await mongoose.connection.close()
  })

  it('devrait créer un nouveau payment', async () => {
    const paymentData = {
      paymentIntentId: '4242',
      amount: 42,
      currency: 'Euro',
      status: 'oui',
      paymentMethod: 'test',
      user: testUser._id,
      order: testOrder._id,
    }

    const newPayment = new Payment(paymentData)
    const savedPayment = await newPayment.save()

    expect(savedPayment._id).toBeDefined()
    expect(savedPayment.order).toBe(paymentData.order)
  })

  it('devrait récupérer un payment par son ID', async () => {
    const paymentData = {
      paymentIntentId: '4242',
      amount: 42,
      currency: 'Euro',
      status: 'oui',
      paymentMethod: 'test',
      user: testUser._id,
      order: testOrder._id,
    }

    const newPayment = new Payment(paymentData)
    const savedPayment = await newPayment.save()

    const foundPayment = await Payment.findById(savedPayment._id)
    expect(foundPayment).not.toBeNull()
    expect(foundPayment?.paymentIntentId).toBe(paymentData.paymentIntentId)
  })

  it('devrait mettre à jour un payment existant', async () => {
    const paymentData = {
      paymentIntentId: '4242',
      amount: 42,
      currency: 'Euro',
      status: 'oui',
      paymentMethod: 'test',
      user: testUser._id,
      order: testOrder._id,
    }

    const newPayment = new Payment(paymentData)
    const savedPayment = await newPayment.save()

    const updatedData = { paymentMethod: 'test unitaire' }
    const updatedPayment = await Payment.findByIdAndUpdate(savedPayment._id, updatedData, { new: true })

    expect(updatedPayment).not.toBeNull()
    expect(updatedPayment?.paymentMethod).toBe(updatedData.paymentMethod)
  })

  it('devrait supprimer un payment', async () => {
    const paymentData = {
      paymentIntentId: '4242',
      amount: 42,
      currency: 'Euro',
      status: 'oui',
      paymentMethod: 'test',
      user: testUser._id,
      order: testOrder._id,
    }

    const newPayment = new Payment(paymentData)
    const savedPayment = await newPayment.save()

    await Payment.findByIdAndDelete(savedPayment._id)
    const deletedPayment = await Payment.findById(savedPayment._id)

    expect(deletedPayment).toBeNull()
  })
})
