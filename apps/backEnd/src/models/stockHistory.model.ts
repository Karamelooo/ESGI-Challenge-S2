import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IStockHistory extends Document {
  product: ObjectId
  quantity: number
  updatedAt: Date
}

const stockHistorySchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
})

const StockHistory = mongoose.model<IStockHistory>('Stock', stockHistorySchema)

export default StockHistory
