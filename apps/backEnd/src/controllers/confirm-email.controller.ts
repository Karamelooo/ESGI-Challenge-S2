import type { Request, Response } from 'express'
import User from '../models/user.model'

export async function confirmEmail(req: Request, res: Response): Promise<any> {
  try {
    const { token } = req.params

    const user = await User.findOne({
      confirmationToken: token,
      confirmationTokenExpiration: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' })
    }

    user.isActive = true
    user.confirmationToken = ''
    user.confirmationTokenExpiration = new Date()
    await user.save()

    return res.status(200).json({ message: 'Votre compte a été activé avec succès' })
  }
  catch (error) {
    return res.status(500).json({ message: error })
  }
}
