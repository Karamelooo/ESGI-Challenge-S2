import type { Document, ObjectId } from 'mongoose'
import mongoose from 'mongoose'

interface IPayment extends Document {
  order: ObjectId
  user: ObjectId
  amount: number
  paymentMethod: string
  paymentStatus: string
  transactionId: string
  createdAt: Date
}

const PaymentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: false}, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false }, 
  createdAt: { type: Date, default: Date.now },
}); // a retravailler psk je sais pas exactement comment ça fonctionne

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)

export default Payment
