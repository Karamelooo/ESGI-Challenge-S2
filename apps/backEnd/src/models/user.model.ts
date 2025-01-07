import type { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IUser extends Document {
  fistname: string
  lastname: string
  email: string
  password: string
  roles: object
  address: object
  createdAt: Date
  confirmationToken: string
  confirmationTokenExpiration: Date
  isActive: boolean
  resetPasswordToken: string
  resetPasswordExpiration: Date
}

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
  confirmationToken: String,
  confirmationTokenExpiration: Date,
  isActive: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpiration: Date,
})

const User = mongoose.model<IUser>('User', userSchema)

export default User
