import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Thread from '@/models/Thread';
import Message from '@/models/Message';
import User from '@/models/User';

// Placeholder authentication function
// In a real app, this would validate the user's Firebase JWT token
async function authenticateUser(request: Request) {
  // This is a simplified mock - in production, implement proper token validation
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  // Mock user lookup - in real app, validate token and get user from Firebase
  const user = await User.findOne({ uid: token });
  return user;
}

// Simple content moderation
function moderateContent(content: string): boolean {
  // Check for offensive language or spam patterns
  const offensivePatterns = [
    /\b(fuck|shit|ass|bitch)\b/i,
    // Add more patterns as needed
  ];
  
  return !offensivePatterns.some(pattern => pattern.test(content));
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { threadId, content, parentId } = body;
    
    // Basic validation
    if (!threadId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Thread ID and content are required' },
        { status: 400 }
      );
    }
    
    // Moderate content
    if (!moderateContent(content)) {
      return NextResponse.json(
        { error: 'Your message contains inappropriate content' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Verify the thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }
    
    // If this is a reply, verify the parent message exists
    if (parentId) {
      const parentMessage = await Message.findById(parentId);
      if (!parentMessage || parentMessage.threadId.toString() !== threadId) {
        return NextResponse.json(
          { error: 'Parent message not found or does not belong to this thread' },
          { status: 400 }
        );
      }
    }
    
    // Create message
    const message = await Message.create({
      threadId,
      authorId: user._id,
      authorHandle: user.handle,
      content,
      created: new Date(),
      parentId: parentId || undefined,
    });
    
    // Update thread's lastActivity and messageCount
    await Thread.findByIdAndUpdate(threadId, {
      lastActivity: new Date(),
      $inc: { messageCount: 1 }
    });
    
    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Error posting message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 