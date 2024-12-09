import bcrypt from 'bcryptjs';
import { Document, Schema, model } from 'mongoose';

export type UserRole = 'admin' | 'user' | 'comptable';

interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: UserRole[];
  address: object;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: ['admin', 'user', 'comptable'], default: ['user'] },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default model<IUser>('User', userSchema);
