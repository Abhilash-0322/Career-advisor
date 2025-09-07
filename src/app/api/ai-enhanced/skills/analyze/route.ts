import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${FASTAPI_BASE_URL}/api/ai-enhanced/skills/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      // Return mock data if FastAPI is not available
      return NextResponse.json({
        analysis_id: `analysis_${Date.now()}`,
        user_id: body.user_id || 'demo_user',
        timestamp: new Date().toISOString(),
        skill_assessment: {
          current_skills: [
            { name: 'Programming', level: 7, category: 'Technical' },
            { name: 'Problem Solving', level: 8, category: 'Analytical' },
            { name: 'Communication', level: 6, category: 'Soft Skills' },
            { name: 'Leadership', level: 5, category: 'Management' }
          ],
          skill_gaps: [
            {
              skill_name: 'Advanced Data Structures',
              importance: 'High',
              current_level: 4,
              target_level: 8,
              gap_score: 4,
              learning_path: ['Online Courses', 'Practice Problems', 'Projects']
            },
            {
              skill_name: 'Cloud Computing',
              importance: 'Medium',
              current_level: 2,
              target_level: 7,
              gap_score: 5,
              learning_path: ['AWS Certification', 'Hands-on Practice']
            }
          ],
          recommendations: [
            'Focus on strengthening data structures and algorithms',
            'Consider cloud computing certification',
            'Practice system design concepts'
          ],
          confidence_score: 0.82
        },
        career_alignment: {
          compatibility_scores: {
            'Software Engineer': 0.85,
            'Data Scientist': 0.78,
            'Product Manager': 0.65,
            'DevOps Engineer': 0.72
          },
          top_career_match: 'Software Engineer'
        }
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error calling FastAPI:', error)
    
    // Return fallback mock data
    return NextResponse.json({
      analysis_id: `fallback_${Date.now()}`,
      user_id: 'demo_user',
      timestamp: new Date().toISOString(),
      skill_assessment: {
        current_skills: [
          { name: 'General Skills', level: 6, category: 'Mixed' }
        ],
        skill_gaps: [],
        recommendations: ['Continue learning and practicing'],
        confidence_score: 0.5
      },
      career_alignment: {
        compatibility_scores: {},
        top_career_match: 'To be determined'
      }
    })
  }
}
