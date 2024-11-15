import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface ICategory extends Document {
  name: string
  label: string
  description: string
  createdAt: Date
}

const categorySchema = new Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
})

const Category = mongoose.model<ICategory>('Category', categorySchema)

export default Category
