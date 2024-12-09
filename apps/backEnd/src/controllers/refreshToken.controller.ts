import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function refreshToken  (req: Request, res: Response) : Promise<any>  {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'refresh_secret'
    ) as JwtPayload; // Explicitly cast to JwtPayload

    // Generate a new access token
    const newToken = jwt.sign(
      { id: decoded.id }, // Use decoded.id, which is now type-safe
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: newToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};
