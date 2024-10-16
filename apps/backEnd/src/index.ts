import type { Application } from 'express'
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'

// const mongoString = process.env.DB_URL;
const mongoString = 'mongodb://esgi:esgi@database:27017'

mongoose.connect(mongoString).then(() => {
  console.log('Database Connected')
}).catch((error: Error) => {
  console.error(error)
})

const app: Application = express()

app.use(express.json())

app.listen(8080, () => {
  console.log('Server started and listening on port 8080')
})
