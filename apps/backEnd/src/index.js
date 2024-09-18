require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
// const mongoString = process.env.DB_URL
const mongoString = "mongodb://esgi:esgi@database:27017"

mongoose.connect(mongoString)
const database = mongoose.connection

database.on('error', (error) => {
  console.error(error)
})

database.once('connected', () => {
  console.log('Database Connected')
})

const app = express()

app.use(express.json())

app.listen(8080, () => {
  console.log("server started and listen 8080")
})