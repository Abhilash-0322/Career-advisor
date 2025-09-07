import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import AptitudeResult from '@/models/AptitudeResult'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Find user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's aptitude results
    const aptitudeResults = await AptitudeResult.find({ user: user._id })
      .sort({ completedAt: -1 })
      .limit(5)

    // Calculate profile completion
    let profileCompletion = 40 // Base score for having an account
    if (user.name) profileCompletion += 10
    if (user.email) profileCompletion += 10
    if (aptitudeResults.length > 0) profileCompletion += 30
    if (aptitudeResults.length >= 2) profileCompletion += 10

    // Sample recommendations based on results
    const recommendations = {
      courses: [
        { id: 1, name: 'Computer Science Engineering', match: 95 },
        { id: 2, name: 'Data Science', match: 88 },
        { id: 3, name: 'Software Engineering', match: 85 }
      ],
      colleges: [
        { id: 1, name: 'IIT Delhi', match: 92 },
        { id: 2, name: 'NIT Trichy', match: 87 },
        { id: 3, name: 'IIIT Hyderabad', match: 85 }
      ],
      careerPaths: [
        'Software Engineer',
        'Data Scientist',
        'Product Manager',
        'Research Scientist'
      ]
    }

    // Sample upcoming deadlines
    const upcomingDeadlines = [
      { title: 'JEE Main Registration', date: '2025-01-15', type: 'exam' },
      { title: 'NEET Application', date: '2025-02-01', type: 'exam' },
      { title: 'Scholarship Deadline', date: '2025-01-30', type: 'scholarship' }
    ]

    const dashboardData = {
      user: {
        name: user.name || session.user.name || 'Student',
        email: user.email,
        profileCompletion,
        lastActive: new Date().toISOString()
      },
      aptitudeResults: aptitudeResults.map(result => ({
        _id: result._id,
        testType: result.testType,
        completedAt: result.completedAt,
        results: {
          scores: result.results.scores,
          recommendations: result.results.recommendations
        }
      })),
      recommendations,
      upcomingDeadlines
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
