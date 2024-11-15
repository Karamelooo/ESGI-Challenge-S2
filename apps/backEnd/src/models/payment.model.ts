import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IPayment extends Document {
  order: ObjectId
  user: ObjectId
  amount: number
  paymentMethod: string
  paymentStatus: string
  transactionId: string
  createdAt: Date
}

const paymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['CreditCard', 'PayPal'], required: true }, // a modifié
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
}) // a retravailler psk je sais pas exactement comment ça fonctionne

const Payment = mongoose.model<IPayment>('Payment', paymentSchema)

export default Payment
