import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export async function register(req: Request, res: Response): Promise<any> {
  try {
    const { firstname, lastname, email, password, passwordVerification } = req.body
    if (!firstname || !lastname || !email || !password || !passwordVerification) {
      return res.status(422).json({ message: 'Tous les champs sont requis' })
    }

    const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: 'L\'adresse email est invalide' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
    if (!passwordRegex.test(password)) {
      return res.status(422).json({ message: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, des chiffres, des lettres minuscules et majuscules' })
    }

    if (password !== passwordVerification) {
      return res.status(422).json({ message: 'Les mots de passe ne correspondent pas' })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(409).json({ message: 'Cet utilisateur existe déjà' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({ firstname, lastname, email, password: hashedPassword })
    await newUser.save()
    return res.status(200).json({ message: `Utilisateur créé avec l'adresse email suivante : ${newUser.email}` })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
}
