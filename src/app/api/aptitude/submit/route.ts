import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import AptitudeResult from '@/models/AptitudeResult'
import User from '@/models/User'

// Scoring algorithms for different test types
const scoringAlgorithms = {
  personality: (responses: any[]) => {
    const categories = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    }
    
    responses.forEach(response => {
      const score = parseInt(response.answer) || 0
      if (response.questionId.includes('extraversion')) {
        categories.extraversion += score
      } else if (response.questionId.includes('agreeableness')) {
        categories.agreeableness += score
      }
      // Add more category logic
    })
    
    return Object.entries(categories).map(([category, score]) => ({
      category,
      score: Math.min(100, (score / responses.length) * 20), // Normalize to 0-100
      percentile: Math.floor(Math.random() * 100) // Placeholder
    }))
  },
  
  intelligence: (responses: any[]) => {
    const categories = {
      logical: 0,
      numerical: 0,
      verbal: 0,
      spatial: 0
    }
    
    responses.forEach(response => {
      const score = parseInt(response.answer) || 0
      // Simple scoring logic - in production, use proper IQ scoring
      Object.keys(categories).forEach(category => {
        categories[category as keyof typeof categories] += score
      })
    })
    
    return Object.entries(categories).map(([category, score]) => ({
      category,
      score: Math.min(100, (score / responses.length) * 25),
      percentile: Math.floor(Math.random() * 100)
    }))
  },
  
  interest: (responses: any[]) => {
    const categories = {
      science: 0,
      technology: 0,
      engineering: 0,
      arts: 0,
      business: 0,
      social: 0
    }
    
    responses.forEach(response => {
      const score = parseInt(response.answer) || 0
      // Interest scoring based on response patterns
      Object.keys(categories).forEach(category => {
        categories[category as keyof typeof categories] += score
      })
    })
    
    return Object.entries(categories).map(([category, score]) => ({
      category,
      score: Math.min(100, (score / responses.length) * 20),
      percentile: Math.floor(Math.random() * 100)
    }))
  },
  
  skill: (responses: any[]) => {
    const categories = {
      technical: 0,
      communication: 0,
      leadership: 0,
      analytical: 0,
      creative: 0
    }
    
    responses.forEach(response => {
      const score = parseInt(response.answer) || 0
      Object.keys(categories).forEach(category => {
        categories[category as keyof typeof categories] += score
      })
    })
    
    return Object.entries(categories).map(([category, score]) => ({
      category,
      score: Math.min(100, (score / responses.length) * 20),
      percentile: Math.floor(Math.random() * 100)
    }))
  }
}

// Generate recommendations based on scores
const generateRecommendations = (testType: string, scores: any[]) => {
  const recommendations = {
    streams: [] as string[],
    courses: [] as string[],
    careerPaths: [] as string[]
  }
  
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 3)
  
  switch (testType) {
    case 'personality':
      if (topScores[0]?.category === 'extraversion') {
        recommendations.streams.push('management', 'commerce')
        recommendations.careerPaths.push('Business Management', 'Sales', 'Marketing')
      }
      if (topScores.some(s => s.category === 'openness')) {
        recommendations.streams.push('arts', 'science')
        recommendations.careerPaths.push('Research', 'Creative Arts', 'Innovation')
      }
      break
      
    case 'intelligence':
      if (topScores[0]?.category === 'logical') {
        recommendations.streams.push('engineering', 'science')
        recommendations.careerPaths.push('Software Engineering', 'Data Science', 'Research')
      }
      if (topScores.some(s => s.category === 'numerical')) {
        recommendations.streams.push('engineering', 'commerce')
        recommendations.careerPaths.push('Finance', 'Accounting', 'Engineering')
      }
      break
      
    case 'interest':
      if (topScores[0]?.category === 'technology') {
        recommendations.streams.push('engineering', 'science')
        recommendations.careerPaths.push('Software Development', 'IT Consulting', 'Cybersecurity')
      }
      if (topScores.some(s => s.category === 'arts')) {
        recommendations.streams.push('arts', 'vocational')
        recommendations.careerPaths.push('Graphic Design', 'Literature', 'Performing Arts')
      }
      break
      
    case 'skill':
      if (topScores[0]?.category === 'technical') {
        recommendations.streams.push('engineering', 'vocational')
        recommendations.careerPaths.push('Technical Support', 'Engineering', 'IT Services')
      }
      break
  }
  
  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { testType, responses } = await request.json()

    if (!testType || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Find user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate scores using appropriate algorithm
    const scoringAlgorithm = scoringAlgorithms[testType as keyof typeof scoringAlgorithms]
    if (!scoringAlgorithm) {
      return NextResponse.json(
        { error: 'Invalid test type' },
        { status: 400 }
      )
    }

    const scores = scoringAlgorithm(responses)
    const recommendations = generateRecommendations(testType, scores)

    // Generate personality insights for personality tests
    const personality = testType === 'personality' ? {
      type: scores[0]?.category || 'balanced',
      traits: scores.slice(0, 3).map(s => s.category),
      strengths: scores.filter(s => s.score > 70).map(s => s.category),
      challenges: scores.filter(s => s.score < 30).map(s => s.category)
    } : undefined

    // Create aptitude result
    const aptitudeResult = new AptitudeResult({
      user: user._id,
      testType,
      responses,
      results: {
        scores,
        recommendations,
        ...(personality && { personality })
      },
      completedAt: new Date()
    })

    await aptitudeResult.save()

    return NextResponse.json({
      id: aptitudeResult._id,
      message: 'Assessment submitted successfully'
    })

  } catch (error) {
    console.error('Error submitting aptitude test:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
