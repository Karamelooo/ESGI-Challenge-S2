import express, { Express } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bodyParser from 'body-parser';
import productRoutes from '../dist/src/routes/productRoutes';

const mongoString: string = process.env.DB_URL || 'mongodb://esgi:esgi@database:27017';

mongoose.connect(mongoString)
    .then(() => {
        console.log('Database Connected');
    })
    .catch((error: Error) => {
        console.error(error);
    });

const app: Express = express();
app.use(express.json());

app.use(bodyParser.json());
app.use('/api', productRoutes);

const PORT: number = 8080;
app.listen(PORT, () => {
    console.log(`Server started and listening on port ${PORT}`);
});
