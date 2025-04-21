import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { generateRandomHandle } from '@/lib/handleGenerator';

// Verify if an email is a valid UB email address
function isValidUBEmail(email: string): boolean {
  return email.endsWith('@buffalo.edu');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email format
    if (!email || !isValidUBEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email. Must be a @buffalo.edu address.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    let user = await User.findOne({ email }).select('+email');

    if (!user) {
      // Generate a unique anonymous handle
      let handle;
      let isHandleUnique = false;

      // Make sure the handle is unique
      while (!isHandleUnique) {
        handle = generateRandomHandle();
        const existingUser = await User.findOne({ handle });
        if (!existingUser) {
          isHandleUnique = true;
        }
      }

      // Create new user
      user = await User.create({
        email,
        handle,
        uid: `user_${Date.now()}`, // This would be replaced with Firebase UID in production
        joined: new Date(),
      });
    }

    // In a real implementation, you'd integrate with Firebase here
    // For demo purposes, we're just returning success
    return NextResponse.json({ 
      success: true, 
      message: 'Sign-in link sent successfully' 
    });

  } catch (error) {
    console.error('Error in email sign-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 