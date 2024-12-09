import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface Ipermission extends Document {
  name: string
  label: string
  description: string
  createdAt: Date
}

const PermissionSchema = new Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
})

const Permission = mongoose.model<Ipermission>('Category', PermissionSchema)

export default Permission