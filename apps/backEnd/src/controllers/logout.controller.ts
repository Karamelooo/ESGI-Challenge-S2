import { Request, Response } from 'express';
import { blacklistToken } from '../middlewares/auth.middleware';

export const logout = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    blacklistToken(token);
  }
  res.status(200).json({ message: 'Logged out successfully' });
};
