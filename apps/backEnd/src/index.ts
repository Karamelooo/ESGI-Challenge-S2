import cors from 'cors';
import 'dotenv/config';
import type { Application } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
// Using .env for MongoDB connection string if available
const mongoString = process.env.DB_URL || 'mongodb://esgi:esgi@database:27017';


mongoose.connect(mongoString)
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error: Error) => {
    console.error('❌ Database connection failed:', error);
  });

  const app: Application = express();
  app.use(cors());
app.use(express.json());

// Simple test route for server status
app.get('/', (req, res) => {
  res.send('Admin Panel API is running');
});

// Sample users for testing
const users = [
  { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com', lastLogin: '2024-11-01', loginsCount: 5 },
  { id: 2, name: 'Jane Smith', role: 'User', email: 'jane@example.com', lastLogin: '2024-10-30', loginsCount: 10 },
  { id: 3, name: 'Alice Johnson', role: 'User', email: 'alice@example.com', lastLogin: '2024-10-28', loginsCount: 8 },
  { id: 4, name: 'Bob Brown', role: 'User', email: 'bob@example.com', lastLogin: '2024-10-25', loginsCount: 3 },
];

// Route to fetch users
app.get('/users', (req, res) => {
  console.log("Fetching users...");
  res.json(users);
  console.log("Users sent successfully:", users);
});

// DELETE route to delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const newUser = new User({ name, role, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Return the saved user with a 201 status
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Error saving user' });
  }
});

// Catch-all route handler for 404 errors
app.use((req, res) => {
  res.status(404).send(`Cannot find the requested route: ${req.url}`);
});

// Start the server
app.listen(8080, () => {
  console.log('✅ Server started and listening on port 8080');
});
