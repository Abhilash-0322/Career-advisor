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
    
    // First try to find in EnhancedUser
    let user = await EnhancedUser.findOne({ email: session.user.email }).lean()

    // If user doesn't exist in EnhancedUser, create from basic User
    if (!user) {
      const User = require('@/models/User').default
      const basicUser = await User.findOne({ email: session.user.email })
      
      if (basicUser) {
        // Create a new enhanced user document
        const newUserData = {
          name: basicUser.name,
          email: basicUser.email,
          password: basicUser.password,
          role: basicUser.role || 'student',
          educationLevel: '',
          interests: [],
          location: {
            state: '',
            district: '',
            pincode: ''
          },
          academicProfile: {
            educationLevel: '',
            grades: {},
            standardizedTestScores: {}
          },
          careerProfile: {
            goals: [],
            interestedIndustries: [],
            preferredWorkStyle: '',
            careerStage: ''
          },
          skillsProfile: {
            technicalSkills: [],
            softSkills: [],
            certifications: [],
            languages: [],
            skillGaps: []
          },
          aiRecommendationData: {
            lastUpdated: new Date(),
            personalityType: '',
            learningStyle: '',
            recommendationHistory: []
          }
        }
        
        // Save the new user with validation disabled to avoid schema issues
        const enhancedUser = new EnhancedUser(newUserData)
        await enhancedUser.save({ validateBeforeSave: false })
        user = enhancedUser.toObject()
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    }

    // Remove sensitive data
    delete user.password

    return NextResponse.json({
      success: true,
      profile: user
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    const body = await request.json()
    
    // Extract profile data from the request
    const {
      interests = [],
      careerGoals = [],
      currentSkills = [],
      skillGaps = [],
      learningStyle = '',
      timeCommitment = '',
      budgetRange = '',
      educationLevel = '',
      userId,
      email
    } = body

    // Use session email if available, fallback to provided email
    const userEmail = session?.user?.email || email

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await connectDB()
    
    // Try to find existing enhanced user
    let user = await EnhancedUser.findOne({ email: userEmail })

    const profileData = {
      interests,
      educationLevel,
      careerProfile: {
        goals: careerGoals,
        interestedIndustries: interests,
        preferredWorkStyle: learningStyle,
        careerStage: educationLevel
      },
      skillsProfile: {
        technicalSkills: currentSkills,
        softSkills: [],
        certifications: [],
        languages: [],
        skillGaps
      },
      aiRecommendationData: {
        lastUpdated: new Date(),
        personalityType: '',
        learningStyle,
        timeCommitment,
        budgetRange,
        recommendationHistory: []
      }
    }

    if (!user) {
      // Create new enhanced user
      const User = require('@/models/User').default
      const basicUser = await User.findOne({ email: userEmail })
      
      if (basicUser) {
        user = new EnhancedUser({
          name: basicUser.name,
          email: basicUser.email,
          password: basicUser.password,
          role: basicUser.role || 'student',
          ...profileData,
          location: {
            state: '',
            district: '',
            pincode: ''
          },
          academicProfile: {
            educationLevel,
            grades: {},
            standardizedTestScores: {}
          }
        })
      } else {
        // Create anonymous user profile
        user = new EnhancedUser({
          name: session?.user?.name || 'Anonymous User',
          email: userEmail,
          role: 'student',
          ...profileData,
          location: {
            state: '',
            district: '',
            pincode: ''
          },
          academicProfile: {
            educationLevel,
            grades: {},
            standardizedTestScores: {}
          }
        })
      }
      
      await user.save({ validateBeforeSave: false })
    } else {
      // Update existing user
      Object.keys(profileData).forEach(key => {
        user[key] = profileData[key]
      })
      user.academicProfile.educationLevel = educationLevel
      await user.save({ validateBeforeSave: false })
    }

    // After saving profile, trigger AI course recommendations
    let courseRecommendations = []
    try {
      console.log('Triggering AI recommendations for user:', user.email)
      const recommendationPayload = {
        user_profile: {
          user_id: user._id.toString(),
          email: user.email,
          academic_level: educationLevel,
          interests: interests.map(i => i.toLowerCase()),
          career_goals: careerGoals.map(g => g.toLowerCase()),
          current_skills: currentSkills.map(s => s.toLowerCase()),
          skill_gaps: skillGaps.map(s => s.toLowerCase()),
          learning_style: learningStyle,
          time_commitment: timeCommitment,
          budget_range: budgetRange
        },
        max_recommendations: 10,
        focus_areas: interests.map(i => i.toLowerCase())
      }
      
      console.log('Sending recommendation request to FastAPI:', JSON.stringify(recommendationPayload, null, 2))
      
      const recommendationResponse = await fetch(`${FASTAPI_BASE_URL}/api/courses/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendationPayload),
        signal: AbortSignal.timeout(15000)
      })

      console.log('FastAPI response status:', recommendationResponse.status)
      
      if (recommendationResponse.ok) {
        const recommendationData = await recommendationResponse.json()
        console.log('FastAPI response data:', recommendationData)
        courseRecommendations = recommendationData.recommendations || []
        
        console.log('Extracted recommendations:', courseRecommendations.length)
        
        // Store recommendations in user's recommendation history
        if (courseRecommendations.length > 0) {
          user.aiRecommendationData.recommendationHistory.push({
            date: new Date(),
            type: 'course',
            recommendations: courseRecommendations.map((course: any) => JSON.stringify({
              title: course.title,
              provider: course.provider,
              category: course.category || 'AI Recommended',
              level: course.difficulty_level,
              match_percentage: course.match_percentage,
              reasoning: course.reasoning,
              skills_gained: course.skills_gained,
              estimated_duration: course.duration,
              cost: course.estimated_cost,
              rating: course.rating,
              enrollments: course.enrollments,
              url: course.url
            }))
          })
          
          // Update last recommendation timestamp
          user.aiRecommendationData.lastUpdated = new Date()
          await user.save({ validateBeforeSave: false })
          console.log('Recommendations saved to database successfully')
        }
      } else {
        const errorText = await recommendationResponse.text()
        console.log('Failed to get recommendations from AI service:', errorText)
      }
    } catch (aiError) {
      console.error('AI recommendation failed:', aiError)
    }

    // Remove sensitive data
    const savedProfile = user.toObject()
    delete savedProfile.password

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      profile: savedProfile,
      courseRecommendations: courseRecommendations,
      recommendationsCount: courseRecommendations.length
    })

  } catch (error) {
    console.error('Error saving user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    // Clean up the data to ensure proper array structure
    if (updates.skillsProfile) {
      if (updates.skillsProfile.technicalSkills && Array.isArray(updates.skillsProfile.technicalSkills)) {
        updates.skillsProfile.technicalSkills = updates.skillsProfile.technicalSkills.filter(skill => typeof skill === 'string')
      }
      if (updates.skillsProfile.softSkills && Array.isArray(updates.skillsProfile.softSkills)) {
        updates.skillsProfile.softSkills = updates.skillsProfile.softSkills.filter(skill => typeof skill === 'string')
      }
      if (updates.skillsProfile.skillGaps && Array.isArray(updates.skillsProfile.skillGaps)) {
        updates.skillsProfile.skillGaps = updates.skillsProfile.skillGaps.filter(skill => typeof skill === 'string')
      }
    }
    
    if (updates.careerProfile && updates.careerProfile.interestedIndustries && Array.isArray(updates.careerProfile.interestedIndustries)) {
      updates.careerProfile.interestedIndustries = updates.careerProfile.interestedIndustries.filter(industry => typeof industry === 'string')
    }
    
    if (updates.interests && Array.isArray(updates.interests)) {
      updates.interests = updates.interests.filter(interest => typeof interest === 'string')
    }
    
    await connectDB()
    let user = await EnhancedUser.findOne({ email: session.user.email })

    if (!user) {
      // Create user if doesn't exist
      const User = require('@/models/User').default
      const basicUser = await User.findOne({ email: session.user.email })
      
      if (basicUser) {
        user = new EnhancedUser({
          name: basicUser.name,
          email: basicUser.email,
          password: basicUser.password,
          role: basicUser.role || 'student',
          ...updates,
          location: {
            state: '',
            district: '',
            pincode: ''
          },
          aiRecommendationData: {
            lastUpdated: new Date(),
            personalityType: '',
            learningStyle: '',
            recommendationHistory: []
          }
        })
        // Save without validation to avoid schema issues
        await user.save({ validateBeforeSave: false })
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    } else {
      // Update existing user
      Object.keys(updates).forEach(key => {
        if (key !== 'password' && key !== 'email') {
          user[key] = updates[key]
        }
      })
    }

    // Update AI recommendation data timestamp
    user.aiRecommendationData.lastUpdated = new Date()

    await user.save({ validateBeforeSave: false })

    // Trigger AI re-analysis if significant changes
    const significantFields = ['academicProfile', 'careerProfile', 'skillsProfile', 'interests']
    const hasSignificantChanges = significantFields.some(field => updates[field])

    if (hasSignificantChanges) {
      // Trigger background AI analysis
      try {
        await fetch(`${FASTAPI_BASE_URL}/api/users/analyze-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user._id.toString(),
            email: user.email,
            profile_data: {
              academic: user.academicProfile,
              career: user.careerProfile,
              skills: user.skillsProfile,
              interests: user.interests,
              education_level: user.educationLevel
            }
          }),
          signal: AbortSignal.timeout(10000)
        })
      } catch (fastApiError) {
        console.log('Background AI analysis failed, will continue without it')
      }
    }

    // Remove sensitive data
    const updatedProfile = user.toObject()
    delete updatedProfile.password

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      aiAnalysisTriggered: hasSignificantChanges
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
