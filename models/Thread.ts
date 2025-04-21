import mongoose, { Schema, Document } from 'mongoose';

export interface IThread extends Document {
  title: string;
  slug: string; 
  description?: string;
  category: 'professor' | 'course' | 'general';
  courseCode?: string;
  professorName?: string;
  created: Date;
  lastActivity: Date;
  messageCount: number;
}

const ThreadSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['professor', 'course', 'general'],
    required: true,
    index: true,
  },
  courseCode: {
    type: String,
    index: true,
  },
  professorName: {
    type: String,
    index: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  messageCount: {
    type: Number,
    default: 0,
  }
});

// Create text index for search functionality
ThreadSchema.index({ 
  title: 'text', 
  description: 'text', 
  courseCode: 'text', 
  professorName: 'text' 
});

export default mongoose.models.Thread || mongoose.model<IThread>('Thread', ThreadSchema); 