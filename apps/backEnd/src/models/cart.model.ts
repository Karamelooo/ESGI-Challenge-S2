import mongoose, { Document, ObjectId, Schema } from 'mongoose';

interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  userId: ObjectId;
  items: CartItem[];
}

const CartSchema = new Schema<CartDocument>({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

export default mongoose.model<CartDocument>('Cart', CartSchema);