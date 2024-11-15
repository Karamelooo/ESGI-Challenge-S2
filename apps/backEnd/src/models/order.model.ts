import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IOrder extends Document {
  user: ObjectId
  products: [{ product: ObjectId, quantity: number }]
  totalAmount: number
  status: string
  createdAt: Date
  shippingAddress: { street: string, city: string, postalCode: string, country: string }
}

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
})

const Order = mongoose.model<IOrder>('Order', orderSchema)

export default Order
