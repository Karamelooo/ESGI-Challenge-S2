import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IPromoCode extends Document {
  code: string
  discountPercentage: number
  expirationDate: Date
  isActive: boolean
  createdAt: Date
  createdBy: ObjectId
}

const promoCodeSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const PromoCode = mongoose.model<IPromoCode>('PromoCode', promoCodeSchema)

export default PromoCode
