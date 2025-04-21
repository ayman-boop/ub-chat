import mongoose, { Schema, Document } from 'mongoose';
import { IThread } from './Thread';
import { IUser } from './User';

export interface IMessage extends Document {
  threadId: IThread['_id'];
  authorId: IUser['_id'];
  authorHandle: string;
  content: string;
  created: Date;
  edited?: Date;
  parentId?: IMessage['_id']; // For replies
  reactions?: {
    up: number;
    down: number;
  };
  flags?: number; // For moderation
}

const MessageSchema: Schema = new Schema({
  threadId: {
    type: Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
    index: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorHandle: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  edited: {
    type: Date,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    index: true,
  },
  reactions: {
    up: {
      type: Number,
      default: 0,
    },
    down: {
      type: Number,
      default: 0,
    },
  },
  flags: {
    type: Number,
    default: 0,
  },
});

// Create index for querying messages in a thread
MessageSchema.index({ threadId: 1, created: -1 });

// Also index for getting replies to a message
MessageSchema.index({ parentId: 1, created: 1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema); 