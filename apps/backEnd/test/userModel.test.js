import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import User from '../src/models/user.model'

describe('tests du modèle User', () => {
  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017')
  })

  beforeEach(async () => {
    // Nettoyage de la collection User avant chaque test
    await User.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyage de la collection User après chaque test
    await User.deleteMany({})
  })

  afterAll(async () => {
    // Fermeture de la connexion à la base de données
    await mongoose.connection.close()
  })

  it('devrait créer un nouvel utilisateur', async () => {
    const userData = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    expect(savedUser._id).toBeDefined()
    expect(savedUser.email).toBe(userData.email)
  })

  it('ne devrait pas créer un utilisateur avec un email déjà existant', async () => {
    const userData = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    }

    const newUser = new User(userData)
    await newUser.save()

    const duplicateUser = new User(userData)
    await expect(duplicateUser.save()).rejects.toThrow()
  })

  it('devrait récupérer un utilisateur par son ID', async () => {
    const userData = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    const foundUser = await User.findById(savedUser._id)
    expect(foundUser).not.toBeNull()
    expect(foundUser?.email).toBe(userData.email)
  })

  it('devrait mettre à jour un utilisateur existant', async () => {
    const userData = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    const updatedData = { firstname: 'Pierre' }
    const updatedUser = await User.findByIdAndUpdate(savedUser._id, updatedData, { new: true })

    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.firstname).toBe(updatedData.firstname)
  })

  it('devrait supprimer un utilisateur', async () => {
    const userData = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'MotDePasse123!',
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    await User.findByIdAndDelete(savedUser._id)
    const deletedUser = await User.findById(savedUser._id)

    expect(deletedUser).toBeNull()
  })
})
