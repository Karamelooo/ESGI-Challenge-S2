import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
      const userRoles = decoded.roles

      const hasRole = roles.some(role => userRoles.includes(role))
      if (!hasRole) {
        return res.status(403).json({ message: 'Accès non autorisé' })
      }

      next()
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' })
    }
  }
}