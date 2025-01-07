import cors from 'cors'
import 'dotenv/config'
import type { Application, Request, Response } from 'express'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes'
import cartRoutes from './routes/cart.routes'
import paymentRoutes from './routes/payment.routes'
import productRoutes from './routes/product.routes'
// const mongoString = process.env.DB_URL;
const mongoString = 'mongodb://esgi:esgi@database:27017'

mongoose.connect(mongoString).then(() => {
  console.log('Database Connected')
}).catch((error: Error) => {
  console.error(error)
})

const app: Application = express()

app.use(express.json())

app.use(cors({
  origin: ['http://localhost:9000', "http://komsterr.ovh:9000"],
  credentials: true,
}))

app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Le serveur fonctionne correctement' })
})

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/cart',cartRoutes)
app.use('/payment',paymentRoutes)
console.log(authRoutes)

app.listen(8080, () => {
  console.log('Server started and listening on port 8080')
  console.log('sa')
})
