import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IReview extends Document {
  user: ObjectId | string
  product: ObjectId
  rating: number
  comment: string
  createdAt: Date
}

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Note de 1 à 5
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const Review = mongoose.model<IReview>('Review', reviewSchema)

export default Review
