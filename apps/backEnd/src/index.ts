import type { Application } from 'express'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'

// const mongoString = process.env.DB_URL;
const mongoString = 'mongodb://esgi:esgi@database:27017'

mongoose.connect(mongoString).then(() => {
  console.log('Database Connected')
}).catch((error: Error) => {
  console.error(error)
})

const app: Application = express()

app.use(express.json())

app.use(cors({
  origin: 'http://localhost',
  credentials: true
}))

import User from './models/user.model';

app.post('/register', async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email, password } = req.body
    if(!email || !password) {
      return res.status(422).json({ message: 'Tous les champs sont requis' })
    }
    const user = await User.findOne({ email })
    if(user) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' })
    }
    const newUser = new User({ email, password });
    await newUser.save();
    return res.status(200).json({ message: 'Utilisateur créé' })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
})

app.listen(8080, () => {
  console.log('Server started and listening on port 8080')
})
