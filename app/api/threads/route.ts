import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Thread from '@/models/Thread';

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Connect to database
    await connectToDatabase();

    // Build query
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const threads = await Thread.find(query)
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalThreads = await Thread.countDocuments(query);
    
    return NextResponse.json({
      threads,
      pagination: {
        total: totalThreads,
        page,
        limit,
        pages: Math.ceil(totalThreads / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 