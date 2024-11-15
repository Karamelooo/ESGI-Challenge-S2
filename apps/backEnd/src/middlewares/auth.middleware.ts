import type { NextFunction, Request, Response } from 'express'
import process from 'node:process'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ message: 'Authentification requise' })
      return // Ajout du return pour arrêter l'exécution
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string }
    req.userId = decodedToken.userId
    next()
  }
  catch (error) {
    res.status(401).json({ message: error })
  }
}
