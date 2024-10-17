import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user.model'

const router = Router()

router.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).json({ message: 'Tous les champs sont requis' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
    if (!passwordRegex.test(password)) {
      return res.status(422).json({ message: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, des chiffres, des lettres minuscules et majuscules' })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(409).json({ message: 'Cet ufdkmvkdlkdgjdfllcklgkfmlkte déjà' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({ email, password: hashedPassword })
    await newUser.save()
    return res.status(200).json({ message: 'Utilisateur créé' })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
})

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).json({ message: 'Tous les champs sont requis' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(409).json({ message: 'Aucune correspondance trouvée' })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(409).json({ message: 'Aucune correspondance trouvée' })
    }
    return res.status(200).json({ message: 'Connexion réussie' })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
})

export default router
