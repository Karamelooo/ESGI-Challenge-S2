import type { Request, Response } from 'express'
import process from 'node:process'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { sendLockoutEmail } from '../services/email.service'

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
    if (!user.isActive) {
      return res.status(409).json({
        message: 'Aucune correspondance trouvée',
      })
    }
    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.loginAttempts = 0
      user.lockUntil = null
      await user.save()
    }
    else if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        message: 'Essai sur cet email bloqué. Veuillez réessayer plus tard.',
      })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      user.loginAttempts += 1

      if (user.loginAttempts >= 3) {
        const lockUntil = new Date()
        lockUntil.setMinutes(lockUntil.getMinutes() + 30)
        user.lockUntil = lockUntil
        await sendLockoutEmail(user.email, lockUntil)
      }

      await user.save()

      return res.status(409).json({ message: 'Aucune correspondance trouvée' })
    }
    user.loginAttempts = 0
    user.lockUntil = null
    await user.save()
    const token = jwt.sign(
      {
        userId: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' },
    )

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
}
