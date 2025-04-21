import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  handle: string;
  joined: Date;
  email?: string; // Only stored to prevent duplicates, never displayed
}

const UserSchema: Schema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    sparse: true, // Only indexed if it exists
    unique: true,
    select: false, // Don't include in query results by default
  },
});

// This is to prevent the model from being compiled multiple times
// during development with hot reloading
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 