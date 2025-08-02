import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Placeholder protected route - no authentication logic
    return NextResponse.json({
      message: 'Protected route accessed successfully',
      data: {
        message: 'This is protected data',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Protected route error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to retrieve protected data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 