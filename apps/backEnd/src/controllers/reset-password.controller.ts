import type { Request, Response } from 'express'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import User from '../models/user.model'
import { sendResetPasswordEmail } from '../services/email.service'

export async function requestResetPassword(req: Request, res: Response): Promise<any> {
  try {
    console.log('Requête de réinitialisation reçue:', req.body)
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte associé à cette adresse email' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiration = new Date()
    tokenExpiration.setHours(tokenExpiration.getHours() + 1) // Token valide 1 heure

    user.resetPasswordToken = resetToken
    user.resetPasswordExpiration = tokenExpiration
    await user.save()

    await sendResetPasswordEmail(email, resetToken)

    return res.status(200).json({
      message: 'Un email de réinitialisation a été envoyé à votre adresse email',
    })
  }
  catch (error) {
    console.error('Erreur:', error)
    return res.status(500).json({ message: error })
  }
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${process.env.FRONT_APP_URL}/reset-password/${token}`

  await transporter.sendMail({
    from: '"Deckorama" <noreply@deckorama.com>',
    to: email,
    subject: 'Deckorama - Réinitialisation de votre mot de passe',
    html: `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
  })
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
