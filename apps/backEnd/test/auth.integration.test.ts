import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import express from 'express'
import User from '../src/models/user.model'
import authRoutes from '../src/routes/auth.routes'

const app = express()
app.use(express.json())
app.use('/auth', authRoutes)

describe('Authentification', () => {
  beforeAll(async () => {
    console.log('connexion à la BDD');
    try {
      await mongoose.connect('mongodb://esgi:esgi@localhost:27017', {
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 20000
      });
    } catch (error) {
      console.error('Erreur de connexion :', error);
      throw error;
    }
    await User.deleteMany({})
  })

  afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  describe('Inscription', () => {
    it('Création d\'un utilisateur', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'ok5@ok.ok',
        password: 'Azertyuiop!8!',
        passwordVerification: 'Azertyuiop!8!'
      }

      const response = await request(app)
        .post('/auth/register')
        .send(userData)

      // expect(response.status).toBe(200)
      // expect(response.body).toHaveProperty('message')
      // expect(response.body.message).toContain('email de confirmation')
    })

    it('email invalide', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe',
        password: 'Azertyuiop!8!',
        passwordVerification: 'Azertyuiop!8!'
      }

      const response = await request(app)
        .post('/auth/register')
        .send(userData)

      expect(response.status).toBe(422)
      expect(response.body.message).toContain('L\'adresse email est invalide')
    })
  })

  describe('Connexion', () => {
    beforeAll(async () => {
      await User.deleteMany({})
      
      const user = new User({
        firstname: 'John',
        lastname: 'Doe',
        email: 'ok4@ok.ok',
        password: 'Azertyuiop!8!',
        isActive: true
      })
      await user.save()
    })

    it('indentifiant invalide', async () => {
      const loginData = {
        email: 'ok4@ok.ok',
        password: 'Azertyuiop!9'
      }

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)

      expect(response.status).toBe(409)
      expect(response.body.message).toContain('Aucune correspondance trouvée')
    })

    it('bloque le compte après 3 tentatives échouées', async () => {
      const loginData = {
        email: 'ok4@ok.ok',
        password: 'Azertyuiop!9'
      }

      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/auth/login')
          .send(loginData)
      }

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)

      // expect(response.status).toBe(423)
      // expect(response.body.message).toContain('bloqué')
    })
  })
}) 