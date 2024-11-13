// src/routes/userRoutes.ts
import { Router } from 'express';



const router = Router();

// Exemple de liste d'utilisateurs
const users = [
  { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com', lastLogin: '2024-11-01', loginsCount: 5 },
  { id: 2, name: 'Jane Smith', role: 'User', email: 'jane@example.com', lastLogin: '2024-10-30', loginsCount: 10 },
  { id: 3, name: 'Alice Johnson', role: 'User', email: 'alice@example.com', lastLogin: '2024-10-28', loginsCount: 8 },
  { id: 4, name: 'Bob Brown', role: 'User', email: 'bob@example.com', lastLogin: '2024-10-25', loginsCount: 3 },
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
