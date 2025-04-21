import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Thread from '@/models/Thread';
import Message from '@/models/Message';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = params;
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Connect to database
    await connectToDatabase();

    // Find thread by slug
    const thread = await Thread.findOne({ slug });
    
    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    // Get top-level messages (no parentId)
    const messages = await Message.find({ 
      threadId: thread._id,
      parentId: { $exists: false }
    })
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit);
      
    // Get count for pagination
    const totalMessages = await Message.countDocuments({
      threadId: thread._id,
      parentId: { $exists: false }
    });

    // For each message, get its replies
    const messagesWithReplies = await Promise.all(
      messages.map(async (message) => {
        const replies = await Message.find({ parentId: message._id })
          .sort({ created: 1 })
          .limit(10); // Limit replies to most recent 10
          
        const repliesCount = await Message.countDocuments({ parentId: message._id });
        
        return {
          ...message.toObject(),
          replies,
          repliesCount
        };
      })
    );
    
    return NextResponse.json({
      thread,
      messages: messagesWithReplies,
      pagination: {
        total: totalMessages,
        page,
        limit,
        pages: Math.ceil(totalMessages / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 