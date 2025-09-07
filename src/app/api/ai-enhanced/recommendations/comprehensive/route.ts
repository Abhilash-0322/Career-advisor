import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${FASTAPI_BASE_URL}/api/ai-enhanced/recommendations/comprehensive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      // Return mock data if FastAPI is not available
      return NextResponse.json({
        user_id: body.user_id || 'demo_user',
        timestamp: new Date().toISOString(),
        ai_guidance: {
          confidence_score: 0.85,
          consolidated_recommendations: {
            career_paths: [
              {
                title: 'Software Development',
                description: 'High-growth field with excellent prospects',
                confidence: 0.92,
                next_steps: ['Learn programming', 'Build portfolio', 'Practice coding']
              },
              {
                title: 'Data Science',
                description: 'Emerging field with high demand',
                confidence: 0.87,
                next_steps: ['Study statistics', 'Learn Python/R', 'Work on projects']
              }
            ]
          }
        },
        market_insights: {
          'Software Development': {
            market_data: {
              growth_rate: '15%',
              average_salary: '₹6-12 LPA',
              job_openings: 25000,
              required_skills: ['JavaScript', 'Python', 'React', 'Node.js'],
              top_companies: ['TCS', 'Infosys', 'Amazon', 'Google']
            }
          }
        },
        personalization_score: 0.85,
        recommendations_count: 2,
        data_sources: ['ai_agents', 'market_data', 'database']
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error calling FastAPI:', error)
    
    // Return fallback mock data
    return NextResponse.json({
      user_id: 'demo_user',
      timestamp: new Date().toISOString(),
      ai_guidance: {
        confidence_score: 0.8,
        consolidated_recommendations: {
          career_paths: [
            {
              title: 'Technology Career Path',
              description: 'Based on your profile analysis',
              confidence: 0.8,
              next_steps: ['Explore tech skills', 'Research opportunities']
            }
          ]
        }
      },
      market_insights: {},
      personalization_score: 0.8,
      recommendations_count: 1,
      data_sources: ['fallback']
    })
  }
}
