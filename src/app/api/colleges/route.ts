import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import College from '@/models/College'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const course = searchParams.get('course')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // First try to get enhanced college recommendations from FastAPI
    let enhancedColleges = []
    try {
      const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'
      const fastApiResponse = await fetch(`${FASTAPI_BASE_URL}/api/colleges/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_preferences: {
            location: { state, city },
            college_type: type,
            course_interest: course,
            search_term: search || ''
          }
        }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (fastApiResponse.ok) {
        const fastApiData = await fastApiResponse.json()
        enhancedColleges = fastApiData.recommended_colleges || []
      }
    } catch (fastApiError) {
      console.log('FastAPI colleges not available, using database only:', fastApiError.message)
    }

    // Connect to MongoDB and get colleges
    await connectDB()

    // Build filter object
    const filter: any = {}
    
    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' }
    }
    
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' }
    }

    if (type) {
      filter.type = type
    }

    if (course) {
      filter.courses = { $in: [course] }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { affiliation: { $regex: search, $options: 'i' } }
      ]
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get colleges with pagination
    const dbColleges = await College.find(filter)
      .sort({ 'rankings.nirf': 1, name: 1 })
      .skip(skip)
      .limit(limit)

    // Merge enhanced colleges with database colleges
    const allColleges: any[] = []
    
    // Add enhanced colleges first (if available and match filters)
    enhancedColleges.forEach((enhancedCollege: any) => {
      // Apply same filtering logic to enhanced colleges
      let matches = true
      if (state && !enhancedCollege.location?.state?.toLowerCase().includes(state.toLowerCase())) {
        matches = false
      }
      if (city && !enhancedCollege.location?.city?.toLowerCase().includes(city.toLowerCase())) {
        matches = false
      }
      if (type && enhancedCollege.type !== type) {
        matches = false
      }
      if (search && !enhancedCollege.name.toLowerCase().includes(search.toLowerCase())) {
        matches = false
      }

      if (matches) {
        allColleges.push({
          _id: enhancedCollege.id || `enhanced_${Math.random()}`,
          name: enhancedCollege.name,
          type: enhancedCollege.type || 'Government',
          location: {
            city: enhancedCollege.location?.city || '',
            state: enhancedCollege.location?.state || '',
            pincode: enhancedCollege.location?.pincode || ''
          },
          courses: enhancedCollege.courses || [],
          rankings: {
            nirf: enhancedCollege.rankings?.nirf || null,
            overall: enhancedCollege.rankings?.overall || null
          },
          fees: {
            tuition: enhancedCollege.fees?.tuition || 0,
            hostel: enhancedCollege.fees?.hostel || 0,
            total: enhancedCollege.fees?.total || 0
          },
          facilities: enhancedCollege.facilities || {},
          contact: {
            phone: enhancedCollege.contact?.phone || '',
            email: enhancedCollege.contact?.email || '',
            website: enhancedCollege.contact?.website || ''
          },
          affiliation: enhancedCollege.affiliation || '',
          established: enhancedCollege.established || null,
          placement: enhancedCollege.placement || {},
          isEnhanced: true
        })
      }
    })

    // Add database colleges (avoiding duplicates)
    dbColleges.forEach((college: any) => {
      const isDuplicate = allColleges.some(existing => 
        existing.name.toLowerCase() === college.name.toLowerCase()
      )
      
      if (!isDuplicate) {
        allColleges.push({
          ...college.toObject(),
          _id: college._id.toString(),
          isEnhanced: false
        })
      }
    })

    // Apply pagination to merged results
    const paginatedColleges = allColleges.slice(0, limit)

    // Get total count for pagination
    const dbTotal = await College.countDocuments(filter)
    const total = Math.max(dbTotal, allColleges.length)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      colleges: paginatedColleges,
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
    console.error('Error fetching colleges:', error)
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
    const requiredFields = ['name', 'code', 'type', 'affiliation', 'location', 'established']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const college = new College(body)
    await college.save()

    return NextResponse.json(
      { message: 'College created successfully', college },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Error creating college:', error)

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'College code already exists' },
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
