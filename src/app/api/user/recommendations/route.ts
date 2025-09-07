import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import EnhancedUser from '@/models/EnhancedUser'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const user = await EnhancedUser.findOne({ email: session.user.email }).lean()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Extract course recommendations from recommendation history
    const courseRecommendations = user.aiRecommendationData?.recommendationHistory
      ?.filter(rec => rec.type === 'course')
      ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
      ?.slice(0, 1) // Get only the latest recommendation set
      ?.[0]?.recommendations?.map(rec => {
        try {
          return JSON.parse(rec)
        } catch {
          return null
        }
      })
      ?.filter(rec => rec !== null) || []

    return NextResponse.json({
      success: true,
      recommendations: courseRecommendations,
      lastUpdated: user.aiRecommendationData?.lastUpdated,
      totalRecommendations: courseRecommendations.length
    })

  } catch (error) {
    console.error('Error fetching user recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { forceRefresh = false } = await request.json()

    await connectDB()
    
    const user = await EnhancedUser.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if we have recent recommendations (less than 24 hours old) and not forcing refresh
    const lastRecommendation = user.aiRecommendationData?.recommendationHistory
      ?.filter(rec => rec.type === 'course')
      ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      ?.[0]

    const isRecentRecommendation = lastRecommendation && 
      (new Date().getTime() - new Date(lastRecommendation.date).getTime()) < 24 * 60 * 60 * 1000

    if (isRecentRecommendation && !forceRefresh) {
      // Return existing recommendations
      const existingRecommendations = lastRecommendation.recommendations.map(rec => {
        try {
          return JSON.parse(rec)
        } catch {
          return null
        }
      }).filter(rec => rec !== null)

      return NextResponse.json({
        success: true,
        recommendations: existingRecommendations,
        cached: true,
        lastUpdated: lastRecommendation.date
      })
    }

    // Generate fresh recommendations
    let courseRecommendations = []
    try {
      const recommendationResponse = await fetch(`${FASTAPI_BASE_URL}/api/courses/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: {
            user_id: user._id.toString(),
            email: user.email,
            academic_level: user.academicProfile?.educationLevel || 'undergraduate',
            interests: user.interests?.map(i => i.toLowerCase()) || [],
            career_goals: user.careerProfile?.goals?.map(g => g.toLowerCase()) || [],
            current_skills: user.skillsProfile?.technicalSkills?.map(s => s.toLowerCase()) || [],
            skill_gaps: user.skillsProfile?.skillGaps?.map(s => s.toLowerCase()) || [],
            learning_style: user.aiRecommendationData?.learningStyle || 'hands-on',
            time_commitment: user.aiRecommendationData?.timeCommitment || '10-15',
            budget_range: user.aiRecommendationData?.budgetRange || 'free'
          },
          max_recommendations: 10,
          focus_areas: user.interests?.map(i => i.toLowerCase()) || []
        }),
        signal: AbortSignal.timeout(15000)
      })

      if (recommendationResponse.ok) {
        const recommendationData = await recommendationResponse.json()
        courseRecommendations = recommendationData.courses || []
        
        // Store recommendations in user's recommendation history
        if (courseRecommendations.length > 0) {
          user.aiRecommendationData.recommendationHistory.push({
            date: new Date(),
            type: 'course',
            recommendations: courseRecommendations.map((course: any) => JSON.stringify({
              title: course.title,
              provider: course.provider,
              category: course.category,
              level: course.level,
              match_percentage: course.match_percentage,
              reasoning: course.reasoning,
              skills_gained: course.skills_gained,
              estimated_duration: course.estimated_duration,
              cost: course.cost
            }))
          })
          
          // Update last recommendation timestamp
          user.aiRecommendationData.lastUpdated = new Date()
          await user.save({ validateBeforeSave: false })
        }
      } else {
        throw new Error('Failed to get recommendations from AI service')
      }
    } catch (aiError) {
      console.error('AI recommendation failed:', aiError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate recommendations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      recommendations: courseRecommendations,
      cached: false,
      lastUpdated: new Date()
    })

  } catch (error) {
    console.error('Error generating user recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
