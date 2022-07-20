import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserSchema {
  _id: string;
  email: string;
  username: string;
  password: string;
  name: string;
  location: string;
  avatarUrl: string;
}

export const userSchema = new Schema<UserSchema>({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  avatarUrl: String,
});
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = model<UserSchema>('User', userSchema);

export default User;
