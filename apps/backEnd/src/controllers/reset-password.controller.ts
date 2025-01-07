import type { Request, Response } from 'express'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import User from '../models/user.model'
import { sendResetPasswordEmail } from '../services/email.service'

export async function requestPasswordReset(req: Request, res: Response): Promise<any> {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte associé à cette adresse email' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiration = new Date()
    tokenExpiration.setHours(tokenExpiration.getHours() + 1)

    user.resetPasswordToken = resetToken
    user.resetPasswordExpiration = tokenExpiration
    await user.save()

    await sendResetPasswordEmail(email, resetToken)

    return res.status(200).json({
      message: 'Un email de réinitialisation a été envoyé à votre adresse email',
    })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
}

export async function resetPassword(req: Request, res: Response): Promise<any> {
  try {
    const { token } = req.params
    const { password, passwordVerification } = req.body

    if (password !== passwordVerification) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 12 caractères, incluant des symboles, des chiffres, des lettres minuscules et majuscules',
      })
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    user.password = hashedPassword
    user.resetPasswordToken = ''
    user.resetPasswordExpiration = new Date()
    await user.save()

    return res.status(200).json({ message: 'Mot de passe modifié avec succès' })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
}
