import type { NextFunction, Request, Response } from 'express'
import process from 'node:process'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string }
    req.userId = decodedToken.userId
    next()
  }
  catch (error) {
    res.status(401).json({ message: error })
  }
}
