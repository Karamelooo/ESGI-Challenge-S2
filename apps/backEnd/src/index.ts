import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import roleRoutes from './routes/role.routes';

const mongoString = 'mongodb://esgi:esgi@database:27017';

mongoose.connect(mongoString).then(() => {
  console.log('Database Connected');
}).catch((error: Error) => {
  console.error(error);
});

// Let TS infer the type of app
const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost',
  credentials: true,
}));

// Remove explicit types from req and res
app.get('/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne correctement' });
});

app.use('/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/role', roleRoutes);


console.log(authRoutes);

app.listen(8080, () => {
  console.log('Server started and listening on port 8080');
});
