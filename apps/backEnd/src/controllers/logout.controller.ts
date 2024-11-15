import type { Request, Response } from 'express'

export async function logout(req: Request, res: Response): Promise<any> {
  try {
    // Supprimer le token des headers
    delete req.headers.authorization

    // Retourner la réponse de succès
    return res.status(200).json({ message: 'Déconnexion réussie' })
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message || 'Erreur lors de la déconnexion' })
  }
}
