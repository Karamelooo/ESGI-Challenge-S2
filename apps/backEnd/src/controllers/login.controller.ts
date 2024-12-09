import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Explicitly return after sending a response
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return; // Explicitly return after sending a response
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      { expiresIn: '7d' }
    );

    // Send the response
    res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return; // Explicitly return after sending a response
  }
};
