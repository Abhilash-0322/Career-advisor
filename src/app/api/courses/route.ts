import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Course from '@/models/Course'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // First try to get enhanced course recommendations from FastAPI
    let enhancedCourses = []
    try {
      const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'
      
      // Create proper request format for FastAPI
      const fastApiPayload = {
        user_profile: {
          user_id: "guest_user",
          email: "guest@example.com",
          academic_level: "undergraduate",
          interests: search ? [search] : (category ? [category] : ['technology', 'programming']),
          career_goals: [],
          current_skills: [],
          skill_gaps: [],
          learning_style: "visual",
          time_commitment: "5-10 hours per week",
          budget_range: "$0-100"
        },
        max_recommendations: limit,
        focus_areas: search ? [search] : (category ? [category] : [])
      }
      
      const fastApiResponse = await fetch(`${FASTAPI_BASE_URL}/api/courses/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fastApiPayload),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (fastApiResponse.ok) {
        const fastApiData = await fastApiResponse.json()
        enhancedCourses = fastApiData.recommendations || []
        console.log('Enhanced courses from FastAPI:', enhancedCourses.length)
      } else {
        console.log('FastAPI returned error:', fastApiResponse.status, await fastApiResponse.text())
      }
    } catch (fastApiError) {
      console.log('FastAPI courses not available, using database only:', fastApiError.message)
    }

    // Connect to MongoDB and get courses
    await connectDB()

    // Build filter object
    const filter: any = {}
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get courses with pagination
    const dbCourses = await Course.find(filter)
      .sort({ averageSalary: -1, title: 1 })
      .skip(skip)
      .limit(limit)

    // Merge enhanced courses with database courses
    const allCourses = []
    
    // Add enhanced courses first (if available and match filters)
    enhancedCourses.forEach((enhancedCourse: any) => {
      // Apply same filtering logic to enhanced courses
      let matches = true
      if (category && category !== 'all' && enhancedCourse.category !== category) {
        matches = false
      }
      if (search && !enhancedCourse.title.toLowerCase().includes(search.toLowerCase()) && 
          !enhancedCourse.description.toLowerCase().includes(search.toLowerCase())) {
        matches = false
      }

      if (matches) {
        allCourses.push({
          _id: enhancedCourse.id || `enhanced_${Math.random()}`,
          title: enhancedCourse.title,
          code: enhancedCourse.code || 'N/A',
          category: enhancedCourse.category || 'General',
          duration: enhancedCourse.duration || '4 years',
          description: enhancedCourse.description,
          careerProspects: enhancedCourse.career_prospects?.map((prospect: any) => ({
            role: prospect.role,
            averageSalary: prospect.average_salary || 0,
            growthRate: prospect.growth_rate || 0
          })) || [],
          skills: enhancedCourse.skills || [],
          averageSalary: enhancedCourse.average_salary || 0,
          topRecruiters: enhancedCourse.top_recruiters || [],
          isEnhanced: true
        })
      }
    })

    // Add database courses (avoiding duplicates)
    dbCourses.forEach((course: any) => {
      const isDuplicate = allCourses.some(existing => 
        existing.title.toLowerCase() === course.title.toLowerCase()
      )
      
      if (!isDuplicate) {
        allCourses.push({
          ...course.toObject(),
          _id: course._id.toString(),
          isEnhanced: false
        })
      }
    })

    // Apply pagination to merged results
    const paginatedCourses = allCourses.slice(0, limit)

    // Get total count for pagination
    const dbTotal = await Course.countDocuments(filter)
    const total = Math.max(dbTotal, allCourses.length)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      courses: paginatedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    })

  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'code', 'degree', 'stream', 'duration', 'description', 'eligibility']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const course = new Course(body)
    await course.save()

    return NextResponse.json(
      { message: 'Course created successfully', course },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Error creating course:', error)

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Course code already exists' },
        { status: 400 }
      )
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
