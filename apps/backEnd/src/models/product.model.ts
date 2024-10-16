import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IProduct extends Document {
  name: string
  description: string
  price: number
  stock: number
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
})

const Product = mongoose.model<IProduct>('Product', productSchema)

export default Product
