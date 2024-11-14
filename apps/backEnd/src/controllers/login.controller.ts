import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export async function login(req: Request, res: Response): Promise<any> {
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
}
