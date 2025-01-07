import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function checkRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Token manquant' })
      return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
      const userRoles = decoded.roles

      const hasRole = roles.some(role => userRoles.includes(role))
      if (!hasRole) {
        res.status(403).json({ message: 'Accès non autorisé' })
        return
      }

      next()
    }
    catch (error) {
      res.status(401).json({ message: 'Token invalide' })
    }
  }
}
