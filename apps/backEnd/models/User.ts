// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  role: string;
  email: string;
  lastLogin?: Date;
  loginsCount?: number;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  lastLogin: { type: Date, default: Date.now },
  loginsCount: { type: Number, default: 0 },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
