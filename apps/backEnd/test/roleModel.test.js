import mongoose from 'mongoose'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import Role from '../src/models/role.model'

describe('tests du modèle Role', () => {
  beforeAll(async () => {
    // Connexion à la base de données de test
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017')
  })

  beforeEach(async () => {
    // Nettoyage de la collection Role avant chaque test
    await Role.deleteMany({})
  })

  afterEach(async () => {
    // Nettoyage de la collection Role après chaque test
    await Role.deleteMany({})
  })

  afterAll(async () => {
    // Fermeture de la connexion à la base de données
    await mongoose.connection.close()
  })

  it('devrait créer un nouveau role', async () => {
    const roleData = {
      name: 'ROLE_TEST',
      label: 'Test unitaire',
    }

    const newRole = new Role(roleData)
    const savedRole = await newRole.save()

    expect(savedRole._id).toBeDefined()
    expect(savedRole.name).toBe(roleData.name)
    expect(savedRole.label).toBe(roleData.label)
  })

  it('devrait récupérer un role par son ID', async () => {
    const roleData = {
      name: 'ROLE_TEST',
      label: 'Test unitaire',
    }

    const newRole = new Role(roleData)
    const savedRole = await newRole.save()

    const foundRole = await Role.findById(savedRole._id)
    expect(foundRole).not.toBeNull()
    expect(foundRole?.name).toBe(roleData.name)
  })

  it('devrait mettre à jour un role existant', async () => {
    const roleData = {
      name: 'ROLE_TEST',
      label: 'Test unitaire',
    }

    const newRole = new Role(roleData)
    const savedRole = await newRole.save()

    const updatedData = { label: 'test' }
    const updatedRole = await Role.findByIdAndUpdate(savedRole._id, updatedData, { new: true })

    expect(updatedRole).not.toBeNull()
    expect(updatedRole?.label).toBe(updatedData.label)
  })

  it('devrait supprimer un role', async () => {
    const roleData = {
      name: 'ROLE_TEST',
      label: 'Test unitaire',
    }

    const newRole = new Role(roleData)
    const savedRole = await newRole.save()

    await Role.findByIdAndDelete(savedRole._id)
    const deletedRole = await Role.findById(savedRole._id)

    expect(deletedRole).toBeNull()
  })
})
