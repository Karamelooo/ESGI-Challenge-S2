import { Request, Response } from 'express';
import { login } from '../controllers/login.controller';
import { refreshToken } from '../controllers/refreshToken.controller';
import { register } from '../controllers/register.controller';
import { authenticateToken, authorizeRoles, blacklistToken } from '../middlewares/auth.middleware';
var AsyncRouter = require("express-async-router").AsyncRouter;
var router = AsyncRouter();



  
 
  
  
  // Route: Register
  router.post('/register', register);
  
  // Route: Login
  router.post('/login', login);
  
  // Route: Logout
  router.post('/logout', authenticateToken, (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
  
    blacklistToken(token);
    res.status(200).json({ message: 'Logged out successfully' });
  });
  
  // Route: Refresh Token
  router.post('/refresh-token', refreshToken);
  
  // Route: Admin Protected
  router.get('/admin', authenticateToken, authorizeRoles('admin'), (req: Request, res: Response) => {
    res.status(200).json({ message: `Welcome Admin! Your ID is: ${req.user?.id}` });
  });
  

export default router;
