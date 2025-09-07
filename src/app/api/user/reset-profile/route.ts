import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    // Get the MongoDB connection
    const mongoose = require('mongoose')
    
    // Delete existing EnhancedUser document for this email to start fresh
    await mongoose.connection.db.collection('enhancedusers').deleteMany({ 
      email: (session as any).user.email 
    })

    return NextResponse.json({
      success: true,
      message: 'User profile reset successfully. You can now create a new profile.'
    })

  } catch (error) {
    console.error('Error resetting user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset user profile' },
      { status: 500 }
    )
  }
}
