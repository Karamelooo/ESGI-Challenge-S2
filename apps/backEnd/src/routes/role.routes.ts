import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';


var AsyncRouter = require("express-async-router").AsyncRouter;
var router = AsyncRouter();


// Dummy controller to simulate response for role-protected routes
const handleRoleRoute = (role: string) => (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: `Welcome, ${role}! Your ID is: ${req.user?.id}` });
};

// Routes for each role
router.get('/admin', authenticateToken, authorizeRoles('admin'), handleRoleRoute('admin'));
router.get('/user', authenticateToken, authorizeRoles('user'), handleRoleRoute('user'));
router.get('/comptable', authenticateToken, authorizeRoles('comptable'), handleRoleRoute('comptable'));

export default router;

