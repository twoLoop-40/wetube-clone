import { Schema, model } from 'mongoose';
export const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
});
const User = model('User', userSchema);
export default User;
