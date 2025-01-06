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
      return
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('Configuration JWT manquante sur le serveur')
    }

    const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload & { userId: string }
    req.userId = decodedToken.userId
    next()
  }
  catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message })
    } else {
      res.status(401).json({ message: 'Erreur d\'authentification' })
    }
  }
}
