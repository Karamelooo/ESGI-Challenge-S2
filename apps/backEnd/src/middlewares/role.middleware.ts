import { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../models/user.model';

declare module "express" { 
    export interface Request {
      user: any
    }
}
export const authorizeRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access is denied.' });
    }
    next();
  };
};