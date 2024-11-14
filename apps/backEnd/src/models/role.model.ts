import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IRole extends Document {
  name: string
  label: string
}

const roleSchema = new Schema({
  name: { type: String, required: true },
  label: { type: String }
});

const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role