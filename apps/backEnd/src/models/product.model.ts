import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: ObjectId
  stock: number
  images: [string]
  createdAt: Date
}

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, required: true },
    images: [String], // Array de liens d'image
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product