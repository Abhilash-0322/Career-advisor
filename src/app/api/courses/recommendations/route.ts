import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract user preferences and map to the FastAPI expected format
    const { 
      userId, 
      userPreferences,
      maxRecommendations = 10,
      focusAreas = []
    } = body

    // Map frontend data to FastAPI expected format
    const fastApiRequest = {
      user_profile: {
        user_id: userId || 'anonymous_user',
        email: userPreferences?.email || null,
        academic_level: userPreferences?.academicLevel || userPreferences?.education_level || null,
        interests: userPreferences?.interests || [],
        career_goals: userPreferences?.careerGoals || userPreferences?.career_goals || [],
        current_skills: userPreferences?.currentSkills || userPreferences?.current_skills || [],
        skill_gaps: userPreferences?.skillGaps || userPreferences?.skill_gaps || [],
        learning_style: userPreferences?.learningStyle || userPreferences?.learning_style || null,
        time_commitment: userPreferences?.timeCommitment || userPreferences?.time_commitment || null,
        budget_range: userPreferences?.budgetRange || userPreferences?.budget_range || null
      },
      max_recommendations: maxRecommendations,
      focus_areas: focusAreas
    }

    console.log('Sending to FastAPI:', JSON.stringify(fastApiRequest, null, 2))

    // Call FastAPI backend
    const response = await fetch(`${FASTAPI_BASE_URL}/api/courses/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fastApiRequest)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FastAPI Error:', response.status, errorText)
      throw new Error(`FastAPI error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Transform the response to match frontend expectations
    const transformedRecommendations = data.recommendations?.map((rec: any) => ({
      id: `rec_${Date.now()}_${Math.random()}`,
      title: rec.title,
      provider: rec.provider,
      description: rec.description,
      duration: rec.duration,
      level: rec.difficulty_level,
      matchPercentage: rec.match_percentage,
      reasoning: rec.reasoning,
      skills: rec.skills_gained || [],
      prerequisites: rec.prerequisites || [],
      estimatedCost: rec.estimated_cost,
      rating: rec.rating,
      enrollments: rec.enrollments,
      url: rec.url
    })) || []

    return NextResponse.json({
      success: data.success || true,
      recommendations: transformedRecommendations,
      totalFound: data.total_found || transformedRecommendations.length,
      processingTime: data.processing_time || 0,
      generatedAt: data.generated_at || new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Course recommendations error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to get course recommendations',
        recommendations: [],
        totalFound: 0
      },
      { status: 500 }
    )
  }
}
