import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import connectDB from '@/lib/db'
import Course from '@/models/Course'
import College from '@/models/College'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { userProfile, aptitudeScores, preferences } = body

    // Get available courses and colleges
    const courses = await Course.find({}).limit(20)
    const colleges = await College.find({}).limit(20)

    // Create context for AI recommendation
    const context = {
      userProfile,
      aptitudeScores,
      preferences,
      availableCourses: courses.map(course => ({
        title: course.title,
        category: course.category,
        skills: course.skills,
        averageSalary: course.averageSalary,
        jobMarketDemand: course.jobMarketDemand
      })),
      availableColleges: colleges.map(college => ({
        name: college.name,
        type: college.type,
        location: college.location,
        ranking: college.ranking
      }))
    }

    // Generate AI recommendations using Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert career counselor and educational advisor. Based on the user's profile, aptitude test scores, and preferences, provide personalized career and educational recommendations. 

Your response should be a JSON object with the following structure:
{
  "courseRecommendations": [
    {
      "title": "Course Title",
      "category": "Engineering/Medical/Business/Arts",
      "match_percentage": 85,
      "reasons": ["reason1", "reason2"],
      "career_prospects": ["job1", "job2"],
      "salary_range": "INR X - Y LPA"
    }
  ],
  "collegeRecommendations": [
    {
      "name": "College Name",
      "type": "Government/Private",
      "location": "City, State",
      "match_percentage": 90,
      "reasons": ["reason1", "reason2"],
      "specializations": ["spec1", "spec2"]
    }
  ],
  "careerPath": {
    "immediate_steps": ["step1", "step2"],
    "short_term_goals": ["goal1", "goal2"],
    "long_term_vision": "career vision",
    "skills_to_develop": ["skill1", "skill2"]
  },
  "personalizedAdvice": "Detailed advice based on user profile"
}

Consider factors like:
- Aptitude test performance in different areas
- User's interests and preferences
- Market demand and salary prospects
- Geographic preferences
- Family background and constraints
- Long-term career goals`
        },
        {
          role: "user",
          content: `Please analyze my profile and provide career recommendations:

User Profile: ${JSON.stringify(userProfile)}
Aptitude Scores: ${JSON.stringify(aptitudeScores)}
Preferences: ${JSON.stringify(preferences)}

Available Options: ${JSON.stringify(context, null, 2)}`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2000
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse AI response
    let recommendations
    try {
      recommendations = JSON.parse(aiResponse)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      recommendations = {
        courseRecommendations: [],
        collegeRecommendations: [],
        careerPath: {
          immediate_steps: [],
          short_term_goals: [],
          long_term_vision: "Personalized career guidance based on your profile",
          skills_to_develop: []
        },
        personalizedAdvice: aiResponse
      }
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
