import mongoose, { Document, Schema } from 'mongoose';

interface IPayment extends Document {
  userId: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  invoiceUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}); // a retravailler psk je sais pas exactement comment ça fonctionne

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)

export default Payment
