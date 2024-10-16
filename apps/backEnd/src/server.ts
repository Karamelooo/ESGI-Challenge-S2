import cors from 'cors';
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Route simple pour tester
app.get('/', (req, res) => {
  res.send('Panneau Admin en TypeScript');
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});


// Utilisation des routes d'utilisateurs
app.use('/api', userRoutes);
