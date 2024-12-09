import mongoose, { Document, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUser extends Document {
  username: string;
  role: string; // or Role reference if dynamic
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
});

// Plugin passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
