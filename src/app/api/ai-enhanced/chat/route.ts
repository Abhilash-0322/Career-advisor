import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${FASTAPI_BASE_URL}/api/ai-enhanced/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      // Return mock data if FastAPI is not available
      const { message, user_id } = body
      
      // Simple mock responses based on message content
      let mockResponse = "I'm here to help with your career guidance questions. "
      
      if (message.toLowerCase().includes('career')) {
        mockResponse = "Based on your profile, I'd recommend exploring careers in technology, specifically software development or data science. These fields offer excellent growth opportunities and align with current market trends."
      } else if (message.toLowerCase().includes('skill')) {
        mockResponse = "To enhance your skills, I suggest focusing on programming languages like Python or JavaScript, and developing problem-solving abilities through coding practice and projects."
      } else if (message.toLowerCase().includes('college') || message.toLowerCase().includes('course')) {
        mockResponse = "For college selection, consider institutions with strong placement records in your field of interest. Look for programs that offer practical exposure and industry connections."
      } else if (message.toLowerCase().includes('salary') || message.toLowerCase().includes('job')) {
        mockResponse = "Current job market trends show high demand in tech sectors. Entry-level positions typically offer ₹3-8 LPA, with significant growth potential based on skills and experience."
      } else {
        mockResponse += "Feel free to ask me about career paths, skill development, college recommendations, or job market insights."
      }

      return NextResponse.json({
        response: mockResponse,
        timestamp: new Date().toISOString(),
        conversation_id: `conv_${Date.now()}`,
        user_id: user_id || 'demo_user',
        context: {
          intent: 'career_guidance',
          confidence: 0.8,
          relevant_topics: ['career_planning', 'skill_development']
        },
        suggestions: [
          "Tell me about trending career options",
          "How can I improve my technical skills?",
          "What colleges should I consider?",
          "What's the current job market like?"
        ]
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error calling FastAPI:', error)
    
    // Return fallback response
    return NextResponse.json({
      response: "I apologize, but I'm experiencing some technical difficulties. However, I'm still here to help! Please feel free to ask me about career guidance, skill development, or educational opportunities.",
      timestamp: new Date().toISOString(),
      conversation_id: `fallback_${Date.now()}`,
      user_id: 'demo_user',
      context: {
        intent: 'fallback',
        confidence: 0.5,
        relevant_topics: []
      },
      suggestions: [
        "What career options are available?",
        "How to choose the right course?",
        "Skills needed for tech jobs",
        "Best colleges for my field"
      ]
    })
  }
}
