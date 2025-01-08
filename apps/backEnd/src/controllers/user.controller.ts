import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error })
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const user = await User.findById(id).select('-password')
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' })
      return
    }
    res.json(user)
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error })
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const { firstname, lastname, email, password, isActive } = req.body

    if (!firstname || !lastname || !email) {
      res.status(422).json({ message: 'Les champs prénom, nom et email sont requis' })
      return
    }

    const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!emailRegex.test(email)) {
      res.status(422).json({ message: 'L\'adresse email est invalide' })
      return
    }

    const existingUser = await User.findOne({ email, _id: { $ne: id } })
    if (existingUser) {
      res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà' })
      return
    }

    const updateData: any = {
      firstname,
      lastname,
      email,
      isActive,
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
      if (!passwordRegex.test(password)) {
        res.status(422).json({
          message: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, des chiffres, des lettres minuscules et majuscules',
        })
        return
      }
      const saltRounds = 10
      updateData.password = await bcrypt.hash(password, saltRounds)
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    )

    if (!updatedUser) {
      res.status(404).json({ message: 'Utilisateur non trouvé' })
      return
    }

    res.json(updatedUser)
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      res.status(404).json({ message: 'Utilisateur non trouvé' })
      return
    }
    res.status(204).send()
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error })
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { firstname, lastname, email, password, isActive } = req.body

    if (!firstname || !lastname || !email || !password) {
      res.status(422).json({ message: 'Les champs prénom, nom, email et mot de passe sont requis' })
      return
    }

    const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!emailRegex.test(email)) {
      res.status(422).json({ message: 'L\'adresse email est invalide' })
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
    if (!passwordRegex.test(password)) {
      res.status(422).json({
        message: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, des chiffres, des lettres minuscules et majuscules',
      })
      return
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà' })
      return
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      isActive: isActive !== undefined ? isActive : false,
    })

    await newUser.save()
    res.status(201).json(newUser)
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'utilisateur', error })
  }
}
