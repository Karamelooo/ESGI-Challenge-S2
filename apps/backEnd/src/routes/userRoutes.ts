// src/routes/userRoutes.ts
import { Router } from 'express';

const router = Router();

// Exemple de liste d'utilisateurs
const users = [
  { id: 1, name: 'John Doe', role: 'Admin' },
  { id: 2, name: 'Jane Smith', role: 'User' },
];

// Route pour obtenir la liste des utilisateurs
router.get('/users', (req, res) => {
  res.json(users);
});

// Route pour ajouter un nouvel utilisateur
router.post('/users', (req, res) => {
  const newUser = req.body;
  users.push({ id: users.length + 1, ...newUser });
  res.status(201).json(newUser);
});

export default router;
