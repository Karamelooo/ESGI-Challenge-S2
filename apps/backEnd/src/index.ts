import type { Application, Request, Response } from 'express'
import path from 'node:path'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes'
import orderRoutes from './routes/order.routes'
import productRoutes from './routes/product.routes'
import userRoutes from './routes/user.routes'
import 'dotenv/config'
// const mongoString = process.env.DB_URL;
const mongoString = 'mongodb://esgi:esgi@database:27017'

mongoose.connect(mongoString).then(() => {
  console.log('Database Connected')
}).catch((error: Error) => {
  console.error(error)
})

const app: Application = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors({
  origin: ['http://localhost:9000', 'http://komsterr.ovh:9000'],
  credentials: true,
}))

app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Le serveur fonctionne correctement' })
})

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/users', userRoutes)
app.use('/orders', orderRoutes)

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

console.log(authRoutes)

app.listen(8080, () => {
  console.log('Server started and listening on port 8080')
  console.log('sa')
})
