import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import User from '../models/user.model'

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { firstname, lastname, email, password, passwordVerification } = req.body
    if (!firstname || !lastname || !email || !password || !passwordVerification) {
       res.status(422).json({ message: 'Tous les champs sont requis' })
    }

    const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!emailRegex.test(email)) {
       res.status(422).json({ message: 'L\'adresse email est invalide' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
    if (!passwordRegex.test(password)) {
       res.status(422).json({ message: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, des chiffres, des lettres minuscules et majuscules' })
    }

    if (password !== passwordVerification) {
       res.status(422).json({ message: 'Les mots de passe ne correspondent pas' })
    }

    const user = await User.findOne({ email })
    if (user) {
       res.status(409).json({ message: 'Cet utilisateur existe déjà' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({ firstname, lastname, email, password: hashedPassword })
    await newUser.save()
     res.status(200).json({ message: `Utilisateur créé avec l'adresse email suivante : ${newUser.email}` })
  }
  catch (error) {
     res.status(500).json({ message: error })
  }
  return
}
