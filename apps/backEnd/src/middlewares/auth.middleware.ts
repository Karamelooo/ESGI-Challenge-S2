// src/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const blacklistedTokens: Set<string> = new Set();

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; roles: string[] };
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }

  if (blacklistedTokens.has(token)) {
    res.status(403).json({ message: 'Token has been revoked' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload & { id: string; roles: string[] };
    req.user = { id: decoded.id, roles: decoded.roles };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(403).json({ message: 'User not authenticated' });
      return;
    }

    const userRoles = req.user.roles || [];
    if (!roles.some(role => userRoles.includes(role))) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const blacklistToken = (token: string): void => {
  blacklistedTokens.add(token);
};
